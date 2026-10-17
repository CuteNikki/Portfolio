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
