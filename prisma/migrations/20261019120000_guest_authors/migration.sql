-- Authors can be people without an account: each row gets its own id, the user becomes optional, and a name and a
-- link stand in for one. A user still appears at most once per post or project.

-- PostAuthor
ALTER TABLE "PostAuthor" DROP CONSTRAINT "PostAuthor_pkey";
ALTER TABLE "PostAuthor" ADD COLUMN "id" TEXT;
UPDATE "PostAuthor" SET "id" = gen_random_uuid()::text;
ALTER TABLE "PostAuthor" ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "PostAuthor_pkey" PRIMARY KEY ("id");
ALTER TABLE "PostAuthor" ALTER COLUMN "userId" DROP NOT NULL,
ADD COLUMN "name" TEXT,
ADD COLUMN "url" TEXT;
CREATE UNIQUE INDEX "PostAuthor_postId_userId_key" ON "PostAuthor"("postId", "userId");

-- ProjectAuthor
ALTER TABLE "ProjectAuthor" DROP CONSTRAINT "ProjectAuthor_pkey";
ALTER TABLE "ProjectAuthor" ADD COLUMN "id" TEXT;
UPDATE "ProjectAuthor" SET "id" = gen_random_uuid()::text;
ALTER TABLE "ProjectAuthor" ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "ProjectAuthor_pkey" PRIMARY KEY ("id");
ALTER TABLE "ProjectAuthor" ALTER COLUMN "userId" DROP NOT NULL,
ADD COLUMN "name" TEXT,
ADD COLUMN "url" TEXT;
CREATE UNIQUE INDEX "ProjectAuthor_projectId_userId_key" ON "ProjectAuthor"("projectId", "userId");
