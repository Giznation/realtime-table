/*
  Warnings:

  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Record";

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthMonth" TEXT NOT NULL,
    "birthYear" TEXT NOT NULL,
    "countryOfBirth" TEXT NOT NULL,
    "yearMovedToUK" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "highestIncomeJobTitle" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cityOfResidence" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "familyStatus" TEXT NOT NULL,
    "childrenAge" TEXT NOT NULL,
    "listingStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);
