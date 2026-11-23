-- Migration: 20261123_add_payment_attempts
-- Purpose: Support resilient multi-attempt Razorpay payment tracking with idempotency and audit trail
-- Run against database when deploying to production:

CREATE TABLE IF NOT EXISTS "payment_attempts" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "bank" TEXT,
    "wallet" TEXT,
    "vpa" TEXT,
    "errorCode" TEXT,
    "errorDescription" TEXT,
    "rawResponse" JSONB,
    "webhookReceivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

-- Unique index for payment IDs captured by gateway
CREATE UNIQUE INDEX IF NOT EXISTS "payment_attempts_razorpayPaymentId_key" ON "payment_attempts"("razorpayPaymentId");

-- Lookup indexes for high performance order and webhook resolution
CREATE INDEX IF NOT EXISTS "payment_attempts_orderId_idx" ON "payment_attempts"("orderId");
CREATE INDEX IF NOT EXISTS "payment_attempts_razorpayOrderId_idx" ON "payment_attempts"("razorpayOrderId");
CREATE INDEX IF NOT EXISTS "payment_attempts_status_idx" ON "payment_attempts"("status");

-- Foreign key link to orders
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
