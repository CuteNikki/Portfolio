import type { Nodes as HastNodes } from 'hast';
import type { Nodes as MdastNodes } from 'mdast';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { type PluggableList, unified } from 'unified';

import { shorten } from '@/lib/utils';

// The Markdown that posts and projects are written in. MarkdownViewer renders it with these, and the text and headings
// taken from it here are read with them too, so they match the page.
export const remarkPlugins = [
  remarkGfm,
  remarkBreaks,
  remarkGemoji,
] satisfies PluggableList;

const toMdast = unified().use(remarkParse).use(remarkPlugins);
// As react-markdown turns it into HTML, with the heading ids rehype-slug gives them on the page
const toHast = unified()
  .use(remarkParse)
  .use(remarkPlugins)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug);

const mdastText = (node: MdastNodes): string =>
  node.type === 'text' || node.type === 'inlineCode'
    ? node.value
    : node.type === 'break'
      ? ' '
      : 'children' in node
        ? node.children.map(mdastText).join('')
        : '';

const hastText = (node: HastNodes): string =>
  node.type === 'text'
    ? node.value
    : 'children' in node
      ? node.children.map(hastText).join('')
      : '';

// The words of a text as it reads: its paragraphs and table cells, without headings, code blocks, pictures or HTML
function plainText(markdown: string): string {
  const parts: string[] = [];
  const walk = (node: MdastNodes) => {
    if (node.type === 'paragraph' || node.type === 'tableCell') {
      parts.push(mdastText(node));
    } else if ('children' in node) {
      node.children.forEach(walk);
    }
  };
  walk(toMdast.runSync(toMdast.parse(markdown)) as MdastNodes);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * The second and third level headings of a markdown text, with the ids they have on the page, for an "On this page"
 * list.
 */
export function headingsOf(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const walk = (node: HastNodes) => {
    if (
      node.type === 'element' &&
      (node.tagName === 'h2' || node.tagName === 'h3')
    ) {
      const id = node.properties.id;
      if (typeof id === 'string' && id) {
        entries.push({
          id,
          text: hastText(node).trim(),
          level: node.tagName === 'h2' ? 2 : 3,
        });
      }
    } else if ('children' in node) {
      node.children.forEach(walk);
    }
  };
  walk(toHast.runSync(toHast.parse(markdown)) as HastNodes);
  return entries;
}

/**
 * Turns markdown into a plain-text excerpt for cards and lists, cut at a word boundary.
 *
 * @param markdown - The markdown source.
 * @param maxLength - The maximum length of the excerpt, including the ellipsis.
 * @returns The plain-text excerpt.
 */
export function toExcerpt(markdown: string, maxLength = 160): string {
  return shorten(plainText(markdown), maxLength);
}

/**
 * Turns markdown into a description for link previews and search results. It ends on the last whole sentence that
 * fits, and only cuts mid-sentence when that sentence would be too short to say much.
 *
 * @param markdown - The markdown source.
 * @param maxLength - The maximum length of the description.
 * @returns The plain-text description.
 */
export function toDescription(markdown: string, maxLength = 160): string {
  const text = plainText(markdown);
  if (text.length <= maxLength) return text;

  const sentences = text.slice(0, maxLength + 1).match(/^.*[.!?](?=\s)/);
  if (sentences && sentences[0].length >= 60) return sentences[0];

  return shorten(text, maxLength);
}

/**
 * Roughly how long a text takes to read, at about 220 words a minute.
 *
 * @param markdown - The text, as markdown.
 * @returns The reading time in whole minutes, at least 1.
 */
export function readingMinutes(markdown: string): number {
  const words = plainText(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
