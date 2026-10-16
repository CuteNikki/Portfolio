-- A project's colour: one picked in the dashboard, and one matched to its cover for when none is picked
ALTER TABLE "Project" ADD COLUMN "tone" INTEGER;
ALTER TABLE "Project" ADD COLUMN "coverTone" INTEGER;
