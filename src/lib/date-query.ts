// Reads a search query as a date, in most of the ways people write one: "26 September", "Sep 26", "26th", "26.",
// "26/09", "26-09", "09/26", "26.09.2026", "2026-09-26", "Sep 2026", "09/2026" or "2026". English and German month
// names both work, and any three or more letters of one count ("sep", "okt", "märz").

export interface DateQuery {
  day: number | null;
  month: number | null;
  year: number | null;
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_NAMES = [
  ['january', 'januar'],
  ['february', 'februar'],
  ['march', 'märz', 'maerz'],
  ['april'],
  ['may', 'mai'],
  ['june', 'juni'],
  ['july', 'juli'],
  ['august'],
  ['september'],
  ['october', 'oktober'],
  ['november'],
  ['december', 'dezember'],
];

function monthOf(word: string) {
  const w = word.replace(/\.$/, '');
  if (w.length < 3) return null;
  const index = MONTH_NAMES.findIndex((names) =>
    names.some((name) => name.startsWith(w)),
  );
  return index === -1 ? null : index + 1;
}

function ordinal(n: number) {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}

// The most days each month can have; February allows the 29th for leap years
const MAX_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isValid({ day, month, year }: DateQuery) {
  return (
    (day === null || (day >= 1 && day <= (month ? MAX_DAYS[month - 1] : 31))) &&
    (month === null || (month >= 1 && month <= 12)) &&
    (day !== null || month !== null || year !== null)
  );
}

// Every valid reading, without duplicates; null when there is none
function readings(candidates: DateQuery[]) {
  const seen = new Set<string>();
  const unique = candidates.filter(isValid).filter((d) => {
    const key = `${d.day}-${d.month}-${d.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.length > 0 ? unique : null;
}

/**
 * Reads a search query as a date. Ambiguous numbers give more than one reading: "05/09" could be 5 September or
 * 9 May. A bare number such as "26" is too vague, so it isn't read as a date.
 *
 * @param raw - The search query.
 * @returns Every reading of the query as a date, or null when it isn't one.
 */
export function parseDateQuery(raw: string): DateQuery[] | null {
  const s = raw.trim().toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ');
  if (!s) return null;

  const fullYear = (value: string) => {
    const n = Number(value);
    return n < 100 ? 2000 + n : n;
  };

  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) {
    return readings([{ day: +m[3], month: +m[2], year: +m[1] }]);
  }
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})$/))) {
    return readings([{ day: null, month: +m[2], year: +m[1] }]);
  }
  if ((m = s.match(/^(\d{1,2})[-/.](\d{4})$/))) {
    return readings([{ day: null, month: +m[1], year: +m[2] }]);
  }
  if ((m = s.match(/^(\d{1,2})([-/.])(\d{1,2})(?:[-/.](\d{2}|\d{4}))?\.?$/))) {
    const a = +m[1];
    const b = +m[3];
    const year = m[4] ? fullYear(m[4]) : null;
    // A dot means the German day.month order; slashes and dashes could be either way round
    if (m[2] === '.') return readings([{ day: a, month: b, year }]);
    return readings([
      { day: a, month: b, year },
      { day: b, month: a, year },
    ]);
  }
  if (/^(19|20)\d{2}$/.test(s)) {
    return readings([{ day: null, month: null, year: +s }]);
  }

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;
  let named = false;
  for (const token of s.split(' ')) {
    if (token === 'of' || token === 'the') continue;
    if ((m = token.match(/^(\d{1,2})(st|nd|rd|th|\.)$/))) {
      if (day !== null) return null;
      day = +m[1];
      named = true;
    } else if (/^\d{4}$/.test(token)) {
      if (year !== null) return null;
      year = +token;
    } else if (/^\d{1,2}$/.test(token)) {
      if (day !== null) return null;
      day = +token;
    } else {
      const found = monthOf(token);
      if (!found || month !== null) return null;
      month = found;
      named = true;
    }
  }

  return named ? readings([{ day, month, year }]) : null;
}

/**
 * Describes a date query in words, e.g. "26 September, any year" or "the 26th of any month".
 */
export function describeDateQuery({ day, month, year }: DateQuery): string {
  const name = month ? MONTHS_LONG[month - 1] : '';
  if (day && month && year) return `${day} ${name} ${year}`;
  if (day && month) return `${day} ${name}, any year`;
  if (month && year) return `${name} ${year}`;
  if (day && year) return `the ${ordinal(day)} of any month in ${year}`;
  if (month) return `${name}, any year`;
  if (year) return `in ${year}`;
  return `the ${ordinal(day ?? 0)} of any month`;
}

/**
 * The short form for a filter chip, e.g. "26 Sep", "Sep 2026", "26th" or "2026".
 */
export function shortDateQuery({ day, month, year }: DateQuery): string {
  return [
    day ? (month ? String(day) : ordinal(day)) : '',
    month ? MONTHS_SHORT[month - 1] : '',
    year ? String(year) : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Whether a date matches any of the readings. Dates are compared in UTC, like they are shown.
 */
export function matchesDateQuery(time: number, queries: DateQuery[]): boolean {
  const date = new Date(time);
  return queries.some(
    ({ day, month, year }) =>
      (day === null || day === date.getUTCDate()) &&
      (month === null || month === date.getUTCMonth() + 1) &&
      (year === null || year === date.getUTCFullYear()),
  );
}
