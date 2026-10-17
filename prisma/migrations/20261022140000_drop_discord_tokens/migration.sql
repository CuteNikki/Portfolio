-- Sign-in only needs the Discord profile, so the Discord tokens aren't kept any more. Apply this after deploying the
-- code without them: older code asks for these columns whenever it loads a whole user, as on every signed-in request.
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
DROP COLUMN "tokenExpiresAt";
