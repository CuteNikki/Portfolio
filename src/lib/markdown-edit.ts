// The editing behind the Markdown toolbar: each takes the text and what's selected in it, and gives back the new text
// and what should be selected afterwards. They don't touch the page, so the field decides how to apply them.

export interface TextState {
  value: string;
  // The selection, as offsets into value; equal when nothing is selected
  start: number;
  end: number;
}

// Replaces start..end with `text`, selecting `select` within the inserted text (from its start), or putting the cursor
// after it
function replace(
  state: TextState,
  start: number,
  end: number,
  text: string,
  select?: [number, number]
): TextState {
  const value = state.value.slice(0, start) + text + state.value.slice(end);
  return select
    ? { value, start: start + select[0], end: start + select[1] }
    : { value, start: start + text.length, end: start + text.length };
}

/**
 * Wraps the selection in `before` and `after`, such as `**` for bold, or unwraps it if it's wrapped already. Spaces at
 * the selection's edges stay outside, as Markdown doesn't take `** bold**`. With nothing selected, `placeholder` is
 * inserted wrapped and selected, ready to type over.
 */
export function toggleWrap(
  state: TextState,
  before: string,
  after: string,
  placeholder: string
): TextState {
  const { value } = state;
  let { start, end } = state;

  // The markers selected along with the text
  const selected = value.slice(start, end);
  if (
    selected.length >= before.length + after.length &&
    selected.startsWith(before) &&
    selected.endsWith(after)
  ) {
    const inner = selected.slice(before.length, selected.length - after.length);
    return replace(state, start, end, inner, [0, inner.length]);
  }

  // The markers just outside the selection
  if (
    value.slice(start - before.length, start) === before &&
    value.slice(end, end + after.length) === after &&
    // A one-character marker that's half of a doubled one, like `_` in `__bold__`, isn't wrapping the selection
    !(before.length === 1 && value[start - 2] === before)
  ) {
    const inner = value.slice(start, end);
    return replace(state, start - before.length, end + after.length, inner, [
      0,
      inner.length,
    ]);
  }

  if (start === end) {
    return replace(state, start, end, before + placeholder + after, [
      before.length,
      before.length + placeholder.length,
    ]);
  }

  while (start < end && /\s/.test(value[start])) start++;
  while (end > start && /\s/.test(value[end - 1])) end--;
  const inner = value.slice(start, end);
  return replace(state, start, end, before + inner + after, [
    before.length,
    before.length + inner.length,
  ]);
}

// From the start of the line `start` is on to the end of the line `end` is on, so whole lines are worked on
function lineRange(value: string, start: number, end: number) {
  const from = value.lastIndexOf('\n', start - 1) + 1;
  // A selection that ends right after a line break doesn't take in the next line
  const last = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const next = value.indexOf('\n', last);
  return [from, next === -1 ? value.length : next] as const;
}

export type LineKind = 'bullet' | 'numbered' | 'task' | 'quote';

const LINE_PATTERNS: Record<LineKind, RegExp> = {
  bullet: /^(\s*)[-*+] (?!\[[ xX]\] )/,
  numbered: /^(\s*)\d+[.)] /,
  task: /^(\s*)[-*+] \[[ xX]\] /,
  quote: /^(\s*)> ?/,
};

/**
 * Makes the selected lines a bulleted, numbered or task list, or a quote, or makes them plain again if they all are
 * already. A line of another list kind is switched over rather than given a second marker.
 */
export function toggleLines(state: TextState, kind: LineKind): TextState {
  const [from, to] = lineRange(state.value, state.start, state.end);
  const lines = state.value.slice(from, to).split('\n');
  const pattern = LINE_PATTERNS[kind];
  const content = lines.filter((line) => line.trim() !== '');
  const remove =
    content.length > 0 && content.every((line) => pattern.test(line));

  let number = 0;
  const changed = lines.map((line) => {
    if (remove) return line.replace(pattern, '$1');
    if (line.trim() === '' && lines.length > 1) return line;
    // Another kind of list marker goes, so a bullet becomes a number rather than both
    const plain = Object.values(LINE_PATTERNS)
      .filter((other) => kind === 'quote' || other !== LINE_PATTERNS.quote)
      .reduce((text, other) => text.replace(other, '$1'), line);
    const indent = /^\s*/.exec(plain)?.[0] ?? '';
    const marker =
      kind === 'bullet'
        ? '- '
        : kind === 'numbered'
          ? `${++number}. `
          : kind === 'task'
            ? '- [ ] '
            : '> ';
    return indent + marker + plain.slice(indent.length);
  });

  const text = changed.join('\n');
  // A single empty line keeps the cursor after its new marker, ready to type
  if (state.start === state.end && lines.length === 1) {
    const cursor = state.start + (text.length - lines[0].length);
    return {
      value: state.value.slice(0, from) + text + state.value.slice(to),
      start: Math.max(from, cursor),
      end: Math.max(from, cursor),
    };
  }
  return replace(state, from, to, text, [0, text.length]);
}

/**
 * Makes the selected lines a heading of `level` (2 to 4; the post's title is the page's only level 1), or plain text
 * with 0. A line that's already a heading of that level becomes plain again.
 */
export function setHeading(state: TextState, level: 0 | 2 | 3 | 4): TextState {
  const [from, to] = lineRange(state.value, state.start, state.end);
  const lines = state.value.slice(from, to).split('\n');
  const marker = '#'.repeat(level) + ' ';
  const same =
    level > 0 &&
    lines.every((line) => line.trim() === '' || line.startsWith(marker));

  const text = lines
    .map((line) => {
      if (line.trim() === '' && lines.length > 1) return line;
      const plain = line.replace(/^#{1,6}\s+/, '');
      return same || level === 0 ? plain : marker + plain;
    })
    .join('\n');

  if (state.start === state.end && lines.length === 1) {
    const cursor = from + text.length;
    return {
      value: state.value.slice(0, from) + text + state.value.slice(to),
      start: cursor,
      end: cursor,
    };
  }
  return replace(state, from, to, text, [0, text.length]);
}

// The heading level of the line the cursor is on, for the toolbar's heading menu
export function headingAt(state: TextState): 0 | 2 | 3 | 4 {
  const [from, to] = lineRange(state.value, state.start, state.start);
  const level = /^(#{2,4}) /.exec(state.value.slice(from, to))?.[1].length;
  return (level ?? 0) as 0 | 2 | 3 | 4;
}

/**
 * Turns the selection into a link. Selected words become the link's text, with its address selected to paste over; a
 * selected address becomes the address, with the text selected. With nothing selected, both are placeholders.
 */
export function insertLink(state: TextState): TextState {
  const selected = state.value.slice(state.start, state.end).trim();
  if (/^https?:\/\/\S+$/.test(selected)) {
    const text = `[link text](${selected})`;
    return replace(state, state.start, state.end, text, [1, 10]);
  }
  const words = selected || 'link text';
  const text = `[${words}](https://)`;
  return replace(
    state,
    state.start,
    state.end,
    text,
    selected ? [words.length + 3, words.length + 11] : [1, 1 + words.length]
  );
}

/**
 * Puts `block` on lines of its own at the selection, with an empty line before and after it so it doesn't run into
 * the text around it, and selects `select` within the block (from its start), or puts the cursor after it.
 */
export function insertBlock(
  state: TextState,
  block: string,
  select?: [number, number]
): TextState {
  const before = state.value.slice(0, state.start);
  const after = state.value.slice(state.end);
  const lead =
    before === ''
      ? ''
      : before.endsWith('\n\n')
        ? ''
        : before.endsWith('\n')
          ? '\n'
          : '\n\n';
  const trail =
    after === ''
      ? '\n'
      : after.startsWith('\n\n')
        ? ''
        : after.startsWith('\n')
          ? '\n'
          : '\n\n';
  const text = lead + block + trail;

  return select
    ? replace(state, state.start, state.end, text, [
        lead.length + select[0],
        lead.length + select[1],
      ])
    : {
        value: before + text + after,
        start: before.length + lead.length + block.length,
        end: before.length + lead.length + block.length,
      };
}

/** Puts the selected lines in a fenced code block, or a block with a placeholder when nothing is selected. */
export function insertCodeBlock(state: TextState): TextState {
  const selected = state.value.slice(state.start, state.end);
  if (selected.includes('\n') || selected.length > 0) {
    const [from, to] = lineRange(state.value, state.start, state.end);
    const code = state.value.slice(from, to);
    return insertBlock(
      { ...state, start: from, end: to },
      '```\n' + code + '\n```',
      [4 + code.length + 1, 4 + code.length + 1]
    );
  }
  return insertBlock(state, '```\ncode\n```', [4, 8]);
}

/** A table with two columns and two rows to fill in, its first header selected. */
export function insertTable(state: TextState): TextState {
  const table = [
    '| Column | Column |',
    '| --- | --- |',
    '| Text | Text |',
    '| Text | Text |',
  ].join('\n');
  return insertBlock(state, table, [2, 8]);
}

// Square brackets end a picture's description, and quotes its caption, so they're escaped inside
const escapeAlt = (text: string) => text.replace(/([\\[\]])/g, '\\$1');
const escapeTitle = (text: string) => text.replace(/(["\\])/g, '\\$1');

export interface Picture {
  url: string;
  // The same picture for dark themes, shown instead of the light one there
  darkUrl?: string | null;
  alt: string;
  caption?: string;
}

/**
 * A picture in the text, as its own paragraph. With a dark version, the two are written one under the other, the
 * light one marked #light and the dark one #dark, which the site shows by theme. The caption goes on the first.
 */
export function pictureMarkdown({ url, darkUrl, alt, caption }: Picture) {
  const description = escapeAlt(alt.trim());
  const title = caption?.trim() ? ` "${escapeTitle(caption.trim())}"` : '';
  if (!darkUrl) return `![${description}](${url}${title})`;
  return `![${description}](${url}#light${title})\n![${description}](${darkUrl}#dark)`;
}
