// No 'use client': on post and project pages this renders on the server, so the syntax highlighter and its languages
// stay out of the browser. The dashboard editors import it from client components for their live preview.

import { type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

import { HeadingLink } from '@/components/dashboard/posts/heading-link';

// Night Owl's comment grey is too faint to read on any of the code backgrounds
const codeStyle = {
  ...nightOwl,
  comment: { ...nightOwl.comment, color: '#8a9b9b' },
};

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

type CodeBlockProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: unknown;
};

const CodeBlock = ({
  children,
  className,
  node, // eslint-disable-line @typescript-eslint/no-unused-vars -- react-markdown's syntax tree, not a DOM attribute
  ...rest
}: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (!match) {
    return (
      <code
        {...rest}
        className='text-foreground bg-muted px-1.5 py-0.5 text-sm font-medium before:content-none after:content-none'
      >
        {children}
      </code>
    );
  }

  return (
    <div className='border-border overflow-hidden border shadow-sm'>
      {/* Header Bar */}
      <div className='border-border bg-muted text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase'>
        <span>{language}</span>
      </div>

      <div className='overflow-x-auto bg-(--code-background)'>
        <SyntaxHighlighter
          {...rest}
          PreTag='div'
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
          }}
          codeTagProps={{
            style: { fontFamily: 'inherit' },
          }}
        >
          {String(children).replace(/\n$/, '')}
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

          pre: ({ children }) => (
            <div className='not-prose my-6'>{children}</div>
          ),

          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
