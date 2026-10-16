-- A post can have a simpler picture for small places: its card in lists and its link preview
ALTER TABLE "Post" ADD COLUMN "thumbnailUrl" TEXT;
