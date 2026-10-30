-- A post's cover and thumbnail can come in versions for dark themes, as a project's cover can
ALTER TABLE "Post" ADD COLUMN "coverDarkUrl" TEXT,
ADD COLUMN "thumbnailDarkUrl" TEXT;
