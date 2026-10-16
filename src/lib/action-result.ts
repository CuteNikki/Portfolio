// What server actions return. A production build replaces a thrown error's message with a generic one, so messages
// meant for people go back as values instead, for the page to show in a toast.
export type ActionResult = { error?: string };
