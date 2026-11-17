import { Router } from 'express';
import { authenticateCronOrOIDC } from '../middleware/cronAuth.js';
import { orderService } from '../services/orderService.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// Require authenticated service-to-service access or OIDC identity token for all jobs
router.use(authenticateCronOrOIDC);

/**
 * POST /api/jobs/cleanup-unpaid-orders
 * Triggered every 5 minutes by Google Cloud Scheduler in Singapore (asia-southeast1).
 * Cancels unpaid PENDING orders older than 30 minutes, restores inventory safely in transactions,
 * and maintains idempotency under concurrent invocations.
 */
router.post('/cleanup-unpaid-orders', async (req, res, next) => {
  try {
    const timeoutMinutes = req.body?.timeoutMinutes ? parseInt(req.body.timeoutMinutes, 10) : 30;
    const result = await orderService.cancelExpiredPendingOrders(isNaN(timeoutMinutes) ? 30 : timeoutMinutes);

    return sendSuccess(res, {
      executedAt: new Date().toISOString(),
      timeoutMinutes: isNaN(timeoutMinutes) ? 30 : timeoutMinutes,
      cancelledCount: result.cancelledCount,
      restoredOrders: result.restoredOrders,
    }, 'Unpaid order cleanup job executed successfully');
  } catch (error: any) {
    console.error('[CloudScheduler Job Error /cleanup-unpaid-orders]:', error);
    return sendError(res, error.message || 'Failed to execute unpaid order cleanup', 500);
  }
});

export default router;

