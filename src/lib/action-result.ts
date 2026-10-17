// What server actions return. A production build replaces a thrown error's message with a generic one, so messages
// meant for people go back as values instead, for the page to show in a toast.
export type ActionResult = { error?: string };

// What creating a post or project returns: where the new one is, or why it wasn't created
export type CreateResult = ActionResult & { id?: string; slug?: string | null };

export const fail = (error: string) => ({ error });
