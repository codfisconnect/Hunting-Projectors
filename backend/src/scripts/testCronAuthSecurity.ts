import { authenticateCronOrOIDC } from '../middleware/cronAuth.js';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function mockReq(headers: Record<string, string> = {}): Request {
  return {
    headers
  } as unknown as Request;
}

function mockRes() {
  const res: any = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    }
  };
  return res;
}

async function runCronAuthSecurityTests() {
  console.log('=== TEST SUITE: CRON / OIDC SECURITY VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      failed++;
    }
  }

  // Backup env
  const origCronSecret = process.env.CRON_SECRET;
  const origSchedulerSecret = process.env.SCHEDULER_SECRET;
  const origServiceUrl = process.env.CLOUD_RUN_SERVICE_URL;
  const origSaEmail = process.env.SCHEDULER_SERVICE_ACCOUNT_EMAIL;

  try {
    process.env.CRON_SECRET = 'SuperSecretSchedulerToken12345!';
    process.env.CLOUD_RUN_SERVICE_URL = 'https://backend-asia-southeast1.run.app';
    process.env.SCHEDULER_SERVICE_ACCOUNT_EMAIL = 'scheduler-sa@napcomputers.iam.gserviceaccount.com';

    // 1. Unauthenticated request (no headers) -> 401
    {
      const req = mockReq({});
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '1. Reject request with no credentials (401)');
    }

    // 2. Ordinary customer JWT token -> 401
    {
      const custToken = jwt.sign({ id: 'user123', role: 'CUSTOMER' }, 'customer-secret');
      const req = mockReq({ authorization: `Bearer ${custToken}` });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '2. Reject ordinary customer JWT token (401)');
    }

    // 3. Forged Google OIDC token (untrusted self-signed signature) -> 401
    {
      const forgedToken = jwt.sign(
        {
          iss: 'https://accounts.google.com',
          aud: 'https://backend-asia-southeast1.run.app',
          email: 'scheduler-sa@napcomputers.iam.gserviceaccount.com',
          exp: Math.floor(Date.now() / 1000) + 3600
        },
        'fake-attacker-private-key'
      );
      const req = mockReq({ authorization: `Bearer ${forgedToken}` });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401 && res.body?.message?.includes('OIDC token verification failed'),
        '3. Reject forged Google token with invalid signature (401)');
    }

    // 4. Malformed bearer token string -> 401
    {
      const req = mockReq({ authorization: 'Bearer not-even-a-jwt' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '4. Reject malformed token string (401)');
    }

    // 5. Expired token simulation -> 401
    {
      const expiredToken = jwt.sign(
        {
          iss: 'https://accounts.google.com',
          aud: 'https://backend-asia-southeast1.run.app',
          email: 'scheduler-sa@napcomputers.iam.gserviceaccount.com',
          exp: Math.floor(Date.now() / 1000) - 300 // expired 5 mins ago
        },
        'fake-key'
      );
      const req = mockReq({ authorization: `Bearer ${expiredToken}` });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '5. Reject expired token (401)');
    }

    // 6. Valid CRON_SECRET via X-Cloud-Scheduler-Secret header -> next()
    {
      const req = mockReq({ 'x-cloud-scheduler-secret': 'SuperSecretSchedulerToken12345!' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(nextCalled && res.statusCode === 200, '6. Accept valid secret via X-Cloud-Scheduler-Secret header');
    }

    // 7. Valid CRON_SECRET via Bearer authorization header -> next()
    {
      const req = mockReq({ authorization: 'Bearer SuperSecretSchedulerToken12345!' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(nextCalled && res.statusCode === 200, '7. Accept valid secret via Bearer authorization header');
    }

    // 8. Invalid secret (wrong value, same length) -> 401
    {
      const req = mockReq({ 'x-cloud-scheduler-secret': 'SuperSecretSchedulerToken12345X' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '8. Reject invalid secret of same length (401)');
    }

    // 9. Invalid secret (different length - tests timing-safe buffer handling without error) -> 401
    {
      const req = mockReq({ 'x-cloud-scheduler-secret': 'short' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '9. Safely reject secret of different length without exception (401)');
    }

    // 10. Empty string secret header -> 401
    {
      const req = mockReq({ 'x-cloud-scheduler-secret': '' });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '10. Reject empty secret header (401)');
    }

    // 11. Timing-safe equal test with long random strings
    {
      const longInput = 'A'.repeat(512);
      const req = mockReq({ 'x-cloud-scheduler-secret': longInput });
      const res = mockRes();
      let nextCalled = false;
      await authenticateCronOrOIDC(req, res, () => { nextCalled = true; });
      assert(!nextCalled && res.statusCode === 401, '11. Safely evaluate large inputs without buffer length errors (401)');
    }

    console.log(`\n=========================================`);
    console.log(`CRON AUTH TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=========================================`);

    if (failed > 0) process.exit(1);
  } finally {
    process.env.CRON_SECRET = origCronSecret;
    process.env.SCHEDULER_SECRET = origSchedulerSecret;
    process.env.CLOUD_RUN_SERVICE_URL = origServiceUrl;
    process.env.SCHEDULER_SERVICE_ACCOUNT_EMAIL = origSaEmail;
  }
}

runCronAuthSecurityTests();
