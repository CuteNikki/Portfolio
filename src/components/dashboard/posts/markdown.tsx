// No 'use client': on post and project pages this renders on the server, so the syntax highlighter and its languages
// stay out of the browser. The dashboard editors import it from client components for their live preview.

import { type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type ExtraProps } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

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
      <div className='code-block overflow-x-auto bg-(--code-background)'>
        <SyntaxHighlighter
          PreTag='div'
          language={language ?? 'text'}
          useInlineStyles={false}
          customStyle={{ padding: '1rem' }}
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

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className='prose prose-zinc dark:prose-invert max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkGemoji]}
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

          code: InlineCode,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
