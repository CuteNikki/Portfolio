/*
  Warnings:

  - The values [AUTHOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Project` table. All the data in the column will be lost.
  - Added the required column `writerId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `writerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'WRITER', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
DROP COLUMN "published",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "writerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "published",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "writerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
