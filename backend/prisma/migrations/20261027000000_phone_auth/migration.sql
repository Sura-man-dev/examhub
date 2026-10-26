CREATE TYPE "VerificationPurpose" AS ENUM ('REGISTER', 'LOGIN');
ALTER TABLE "Student" ADD COLUMN "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE "PhoneVerificationChallenge" (
  "id" UUID NOT NULL,
  "companyId" UUID NOT NULL,
  "phone" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "purpose" "VerificationPurpose" NOT NULL,
  "displayName" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PhoneVerificationChallenge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PhoneVerificationChallenge_companyId_phone_createdAt_idx" ON "PhoneVerificationChallenge"("companyId", "phone", "createdAt");
CREATE INDEX "PhoneVerificationChallenge_expiresAt_idx" ON "PhoneVerificationChallenge"("expiresAt");
