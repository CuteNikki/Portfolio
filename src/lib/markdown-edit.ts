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

// A list item's or quote line's parts: its indent, its marker with the space after it, and what follows
interface Item {
  indent: string;
  marker: string;
  kind: LineKind;
  // For a numbered item: its number, and whether it's written with . or )
  number?: number;
  delimiter?: string;
}

function itemOf(line: string): Item | null {
  let match = /^(\s*)([-*+] \[[ xX]\] )/.exec(line);
  if (match) return { indent: match[1], marker: match[2], kind: 'task' };
  match = /^(\s*)([-*+] )/.exec(line);
  if (match) return { indent: match[1], marker: match[2], kind: 'bullet' };
  match = /^(\s*)((\d+)([.)]) )/.exec(line);
  if (match)
    return {
      indent: match[1],
      marker: match[2],
      kind: 'numbered',
      number: Number(match[3]),
      delimiter: match[4],
    };
  match = /^(\s*)(> ?)/.exec(line);
  if (match) return { indent: match[1], marker: match[2], kind: 'quote' };
  return null;
}

// The marker for the item after `item`: the next number, an unticked box, the same bullet or quote mark
function nextMarker(item: Item) {
  if (item.kind === 'numbered') return `${item.number! + 1}${item.delimiter} `;
  if (item.kind === 'task') return `${item.marker[0]} [ ] `;
  if (item.kind === 'quote') return '> ';
  return item.marker;
}

// Numbers the numbered list that line `index` belongs to in order again, from its first item's number. Only items at
// that line's indent count; deeper lines, such as a nested list, are stepped over, and the list ends at an empty line,
// a shallower line or a line that isn't one of its items. Changes `lines` in place.
function renumberLines(lines: string[], index: number) {
  const item = itemOf(lines[index] ?? '');
  if (item?.kind !== 'numbered') return;
  const depth = item.indent.length;

  // A line deeper than the list's items, which belongs to the item above it
  const deeper = (line: string) =>
    line.trim() !== '' && (/^\s*/.exec(line)?.[0].length ?? 0) > depth;
  const sibling = (line: string) => {
    const other = itemOf(line);
    return other?.kind === 'numbered' && other.indent.length === depth;
  };

  let first = index;
  for (let i = index - 1; i >= 0; i--) {
    if (sibling(lines[i])) first = i;
    else if (!deeper(lines[i])) break;
  }

  let number = itemOf(lines[first])!.number!;
  for (let i = first; i < lines.length; i++) {
    const line = lines[i];
    if (sibling(line)) {
      const current = itemOf(line)!;
      lines[i] =
        current.indent +
        `${number++}${current.delimiter} ` +
        line.slice(current.indent.length + current.marker.length);
    } else if (!deeper(line)) {
      break;
    }
  }
}

// A numbered item just nested with no item above it at its new depth starts its own list, so it's numbered from 1
function startSublist(lines: string[], index: number) {
  const item = itemOf(lines[index]);
  if (item?.kind !== 'numbered') return;
  const depth = item.indent.length;
  for (let i = index - 1; i >= 0; i--) {
    const above = itemOf(lines[i]);
    const aboveDepth = /^\s*/.exec(lines[i])?.[0].length ?? 0;
    if (above?.kind === 'numbered' && above.indent.length === depth) return;
    if (lines[i].trim() === '' || aboveDepth < depth) break;
  }
  lines[index] =
    item.indent +
    `1${item.delimiter} ` +
    lines[index].slice(depth + item.marker.length);
}

// The line a position is on, and how far into that line it is
function lineAt(value: string, offset: number) {
  const before = value.slice(0, offset).split('\n');
  return { line: before.length - 1, column: before[before.length - 1].length };
}

// A position from a line and how far into it, clamped to the line
function offsetOf(lines: string[], line: number, column: number) {
  let offset = 0;
  for (let i = 0; i < line; i++) offset += lines[i].length + 1;
  return offset + Math.min(column, lines[line]?.length ?? 0);
}

/**
 * What Enter does in a list or quote: starts the next item, with the text after the cursor moving into it, and numbers
 * a numbered list in order again. On an empty item it ends the list instead, or moves a nested item out a level. Null
 * where Enter should just break the line, such as outside a list or with text selected.
 */
export function continueList(state: TextState): TextState | null {
  if (state.start !== state.end) return null;
  const { value, start } = state;
  const [from, to] = lineRange(value, start, start);
  const line = value.slice(from, to);
  const item = itemOf(line);
  const markerEnd = from + (item ? item.indent.length + item.marker.length : 0);
  if (!item || start < markerEnd) return null;

  if (line.slice(item.indent.length + item.marker.length).trim() === '') {
    // A nested empty item moves out a level, a top-level one ends the list
    if (item.indent.length > 0) return indentLines(state, -1);
    return {
      value: value.slice(0, from) + value.slice(to),
      start: from,
      end: from,
    };
  }

  const marker = item.indent + nextMarker(item);
  // The text after the cursor moves into the new item, without the space it was split at
  const rest = value.slice(start).replace(/^[ \t]+/, '');
  const lines = (
    value.slice(0, start).replace(/[ \t]+$/, '') +
    '\n' +
    marker +
    rest
  ).split('\n');
  const { line: current } = lineAt(value, start);
  if (item.kind === 'numbered') renumberLines(lines, current + 1);

  // The cursor goes after the new item's marker, wherever renumbering moved it
  const newItem = itemOf(lines[current + 1])!;
  const cursor = offsetOf(
    lines,
    current + 1,
    newItem.indent.length + newItem.marker.length
  );
  return { value: lines.join('\n'), start: cursor, end: cursor };
}

/**
 * What Tab (`direction` 1) and Shift+Tab (-1) do on list lines: indent the selected lines by the marker width of the
 * item above them, so an item nests under it, or move them out to the item they're nested under. Numbered lists are
 * numbered in order again around them, so a newly nested list starts from 1. Null when no selected line is a list
 * item, so Tab can move on to the next field.
 */
export function indentLines(
  state: TextState,
  direction: 1 | -1
): TextState | null {
  const lines = state.value.split('\n');
  const first = lineAt(state.value, state.start);
  const last = lineAt(
    state.value,
    // A selection that ends right after a line break doesn't take in the next line
    state.end > state.start && state.value[state.end - 1] === '\n'
      ? state.end - 1
      : state.end
  );
  const listLine = (line: string) => {
    const item = itemOf(line);
    return !!item && item.kind !== 'quote';
  };
  if (!lines.slice(first.line, last.line + 1).some(listLine)) return null;

  const depthOf = (line: string) => /^\s*/.exec(line)?.[0].length ?? 0;
  const shifts: number[] = [];
  for (let i = first.line; i <= last.line; i++) {
    const line = lines[i];
    const depth = depthOf(line);
    let shift = 0;
    if (line.trim() !== '') {
      if (direction === 1) {
        // The width of the marker of the item above at the same depth, so this one lines up under its text
        shift = 2;
        for (let j = i - 1; j >= 0; j--) {
          const above = itemOf(lines[j]);
          if (
            above &&
            above.kind !== 'quote' &&
            above.indent.length === depth
          ) {
            shift = above.marker.length - (above.kind === 'task' ? 4 : 0);
            break;
          }
          if (lines[j].trim() !== '' && depthOf(lines[j]) < depth) break;
        }
        lines[i] = ' '.repeat(shift) + line;
        startSublist(lines, i);
      } else {
        // Out to the depth of the item it's nested under, or all the way out
        let target = 0;
        for (let j = i - 1; j >= 0; j--) {
          const above = itemOf(lines[j]);
          if (above && above.indent.length < depth) {
            target = above.indent.length;
            break;
          }
        }
        shift = target - depth;
        lines[i] = line.slice(depth - target);
      }
    }
    shifts.push(shift);
  }

  // Each changed line's list, and the one it left, which carries on below it, numbered in order again
  for (let i = first.line; i <= last.line; i++) {
    renumberLines(lines, i);
    if (i > 0) renumberLines(lines, i - 1);
    for (let j = i + 1; j < lines.length && j <= last.line + 1; j++)
      renumberLines(lines, j);
  }

  const start = offsetOf(
    lines,
    first.line,
    Math.max(0, first.column + shifts[0])
  );
  const end = offsetOf(
    lines,
    last.line,
    Math.max(0, last.column + shifts[shifts.length - 1])
  );
  return { value: lines.join('\n'), start, end: Math.max(start, end) };
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
