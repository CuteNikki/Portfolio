// The fields of the dashboard's forms, read in the actions. What arrives comes from the browser, so each reader takes
// whatever was sent and gives the action a value it can check.

/**
 * A text field as it was sent, or an empty string when the form didn't send it.
 */
export function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

/**
 * A comma-separated field, like a project's tags: each item trimmed, without empty ones or repeats.
 */
export function readList(formData: FormData, name: string): string[] {
  const items = readText(formData, name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(items)];
}

/**
 * The date a dashboard form sent in a `date` field (YYYY-MM-DD), at midday UTC so it's the same day in every time zone:
 * undefined if the field is empty or missing, null if it isn't a date.
 */
export function readDate(value: FormDataEntryValue | null) {
  if (!value) return undefined;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T12:00:00Z`);
  // A day that doesn't exist, like 31 February, would otherwise roll over into the next month
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
    ? date
    : null;
}
