-- Posts and projects can have several authors and a cover picture, and projects a gallery of further pictures.
-- The current writer of each post and project becomes its first author before the old column goes.

-- CreateTable
CREATE TABLE "PostAuthor" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostAuthor_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "ProjectAuthor" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectAuthor_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- Copy the current writers over as first authors
INSERT INTO "PostAuthor" ("postId", "userId", "position") SELECT "id", "writerId", 0 FROM "Post";
INSERT INTO "ProjectAuthor" ("projectId", "userId", "position") SELECT "id", "writerId", 0 FROM "Project";

-- CreateIndex
CREATE INDEX "PostAuthor_userId_idx" ON "PostAuthor"("userId");

-- CreateIndex
CREATE INDEX "ProjectAuthor_userId_idx" ON "ProjectAuthor"("userId");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_position_idx" ON "ProjectImage"("projectId", "position");

-- AddForeignKey
ALTER TABLE "PostAuthor" ADD CONSTRAINT "PostAuthor_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAuthor" ADD CONSTRAINT "PostAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAuthor" ADD CONSTRAINT "ProjectAuthor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Only now that the writers are copied: drop the old single-writer columns
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_writerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_writerId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "writerId",
ADD COLUMN     "coverUrl" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "writerId",
ADD COLUMN     "coverUrl" TEXT;
