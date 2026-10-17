// Limits for comments, shared by the comment forms and the checks on the server

export const MAX_COMMENT_LENGTH = 1000;

// Replies nest at most this deep, so threads stay readable; the deepest comments don't offer Reply
export const MAX_COMMENT_DEPTH = 3;
