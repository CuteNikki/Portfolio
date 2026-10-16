-- A picked project colour can also be any colour, as #rrggbb, besides one of the five chart colours (1 to 5)
ALTER TABLE "Project" ALTER COLUMN "tone" TYPE TEXT USING "tone"::text;
