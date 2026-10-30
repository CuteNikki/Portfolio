// No 'use client': on post and project pages this renders on the server, so the syntax highlighter and its languages
// stay out of the browser. The dashboard editors import it from client components for their live preview.

import type { ElementContent } from 'hast';
import { Children, type ComponentPropsWithoutRef, isValidElement } from 'react';
import ReactMarkdown, { type ExtraProps } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { remarkPlugins } from '@/lib/markdown';
import { cn } from '@/lib/utils';

import { HeadingLink } from '@/components/dashboard/posts/heading-link';

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const Heading = ({
    children,
    id,
    node, // eslint-disable-line @typescript-eslint/no-unused-vars -- react-markdown's syntax tree, not a DOM attribute
    ...props
  }: ComponentPropsWithoutRef<'h1'> & { node?: unknown }) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <Tag id={id} className='group relative scroll-mt-20' {...props}>
        {id && <HeadingLink id={id} />}
        {children}
      </Tag>
    );
  };

  Heading.displayName = `Heading${level}`;
  return Heading;
};

// Code within a line. Fenced code without a language looks just like it here, so blocks are drawn from their `pre`
// instead (see CodeBlock) and never get this far.
const InlineCode = ({
  children,
  node, // eslint-disable-line @typescript-eslint/no-unused-vars -- react-markdown's syntax tree, not a DOM attribute
  ...rest
}: ComponentPropsWithoutRef<'code'> & ExtraProps) => (
  <code
    {...rest}
    className='text-foreground bg-muted rounded-md px-1.5 py-0.5 text-sm font-medium before:content-none after:content-none'
  >
    {children}
  </code>
);

// A fenced code block, read from its `pre` element's syntax tree. A language shows in the bar above and colours the
// code; without one, the code stays plain text with its lines and indents kept.
const CodeBlock = ({ node }: ExtraProps) => {
  const code = node?.children[0];
  if (code?.type !== 'element') return null;

  const classes = code.properties.className;
  const language = /language-(\w+)/.exec(
    Array.isArray(classes) ? classes.join(' ') : '',
  )?.[1];
  const text = code.children
    .map((child) => ('value' in child ? child.value : ''))
    .join('')
    .replace(/\n$/, '');

  return (
    <div className='not-prose border-border my-6 overflow-hidden rounded-xl border shadow-sm'>
      {/* Header Bar */}
      {language && (
        <div className='border-border bg-muted text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase'>
          <span>{language}</span>
        </div>
      )}

      {/* The highlighter only marks the tokens; .code-block in globals.css colours them for the theme */}
      <div className='code-block scrollbar-inset-x overflow-x-auto bg-(--code-background)'>
        <SyntaxHighlighter
          PreTag='div'
          language={language ?? 'text'}
          useInlineStyles={false}
          // As wide as the longest line, so the padding stays after it when a long line scrolls sideways
          className='w-max min-w-full p-4'
          codeTagProps={{
            style: { fontFamily: 'inherit' },
          }}
        >
          {text}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// A picture in the text. One whose address ends in #light shows only in light themes and one ending in #dark only in
// dark ones, so a diagram can come in both, written one under the other:
//   ![A diagram](https://…/light.webp#light)
//   ![A diagram](https://…/dark.webp#dark)
// Hidden ones load lazily, so the browser only fetches the one it shows.
const Picture = ({
  src,
  alt,
  title, // eslint-disable-line @typescript-eslint/no-unused-vars -- shown as the caption under the picture instead
  node, // eslint-disable-line @typescript-eslint/no-unused-vars -- react-markdown's syntax tree, not a DOM attribute
  ...rest
}: ComponentPropsWithoutRef<'img'> & ExtraProps) => {
  const theme =
    typeof src === 'string' ? /#(light|dark)$/.exec(src)?.[1] : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- pictures in a post can come from anywhere
    <img
      {...rest}
      src={src}
      alt={alt}
      loading='lazy'
      decoding='async'
      className={cn(
        'bg-card m-0 w-full rounded-xl border',
        theme === 'light' && 'dark:hidden',
        theme === 'dark' && 'hidden dark:block',
      )}
    />
  );
};

const isPicture = (child: ElementContent) =>
  (child.type === 'element' && ['img', 'br'].includes(child.tagName)) ||
  (child.type === 'text' && !child.value.trim());

// A paragraph of nothing but pictures, such as one in both themes, is set apart as a figure with the same rounded frame
// as the code blocks. A picture's title, as in ![…](… "A caption"), shows under it.
const Paragraph = ({
  children,
  node,
  ...rest
}: ComponentPropsWithoutRef<'p'> & ExtraProps) => {
  if (!node?.children.length || !node.children.every(isPicture)) {
    return <p {...rest}>{children}</p>;
  }

  const caption = node.children
    .map((child) =>
      child.type === 'element' && typeof child.properties.title === 'string'
        ? child.properties.title
        : '',
    )
    .find(Boolean);

  return (
    <figure className='not-prose my-8'>
      {/* Only the pictures; the line breaks between them would add space under the frame */}
      {Children.toArray(children).filter(isValidElement)}
      {caption && (
        <figcaption className='text-muted-foreground mt-3 text-center text-xs'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className='prose prose-zinc dark:prose-invert max-w-none'>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeExternalLinks,
            { target: '_blank', rel: ['noopener', 'noreferrer'] },
          ],
        ]}
        components={{
          h1: createHeading(1),
          h2: createHeading(2),
          h3: createHeading(3),
          h4: createHeading(4),
          h5: createHeading(5),
          h6: createHeading(6),

          pre: CodeBlock,
          p: Paragraph,
          img: Picture,

          code: InlineCode,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
