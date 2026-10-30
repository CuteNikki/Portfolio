-- A gallery picture can come in a version for dark themes, as a project's cover can
ALTER TABLE "ProjectImage" ADD COLUMN "darkUrl" TEXT;
