/**
 * The date a dashboard form sent in a `date` field (YYYY-MM-DD), at midday UTC so it's the same day in every time zone:
 * undefined if the field is empty or missing, null if it isn't a date.
 */
export function readDate(value: FormDataEntryValue | null) {
  if (!value) return undefined;

  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
