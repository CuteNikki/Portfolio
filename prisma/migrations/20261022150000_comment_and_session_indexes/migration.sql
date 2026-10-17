-- Postgres doesn't index foreign keys by itself. Comments are read by post on every post page and by author on the
-- account and user pages, deleting a comment finds its replies by parent, and sessions are listed by user.
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");
