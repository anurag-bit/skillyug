/*
  Warnings:

  - A unique constraint covering the columns `[password_reset_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otp_expires" TIMESTAMP(3),
ADD COLUMN     "password_reset_expires" TIMESTAMP(3),
ADD COLUMN     "password_reset_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_password_reset_token_key" ON "public"."User"("password_reset_token");
