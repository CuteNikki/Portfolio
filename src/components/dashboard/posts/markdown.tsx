'use client';

import { type ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const Heading = ({
    children,
    id,
    ...props
  }: ComponentPropsWithoutRef<'h1'> & { node?: unknown }) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const copyLink = () => {
      if (!id) return;
      const url = `${window.location.href.split('#')[0]}#${id}`;
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success('Section link copied!'))
        .catch(() => toast.error('Failed to copy link'));
    };

    return (
      <Tag id={id} className='group relative scroll-mt-20' {...props}>
        <span
          onClick={copyLink}
          className='text-muted-foreground hover:text-primary absolute right-full cursor-pointer pr-3 font-normal opacity-0 transition-opacity select-none group-hover:opacity-100'
          title='Copy link to section'
          aria-hidden='true'
        >
          #
        </span>
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

const CodeBlock = ({ children, className, ...rest }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (!match) {
    return (
      <code
        {...rest}
        className='text-foreground dark:bg-muted/80 catppuccin-macchiato:bg-muted/80 bg-zinc-200 px-1.5 py-0.5 text-sm font-medium before:content-none after:content-none'
      >
        {children}
      </code>
    );
  }

  return (
    <div className='border-border overflow-hidden border shadow-sm'>
      {/* Header Bar */}
      <div className='border-border dark:bg-muted/80 catppuccin-macchiato:bg-muted/80 text-muted-foreground flex items-center justify-between border-b bg-zinc-200 px-4 py-2 text-xs font-semibold tracking-wider uppercase'>
        <span>{language}</span>
      </div>

      <div className='dark:bg-muted catppuccin-macchiato:bg-muted overflow-x-auto bg-zinc-900'>
        <SyntaxHighlighter
          {...rest}
          PreTag='div'
          language={language}
          style={nightOwl}
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
