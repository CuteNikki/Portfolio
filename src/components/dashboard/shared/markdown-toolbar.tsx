'use client';

import {
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  HeadingIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  SquareCodeIcon,
  StrikethroughIcon,
  TableIcon,
  UnderlineIcon,
  type LucideIcon,
} from 'lucide-react';

import {
  insertCodeBlock,
  insertLink,
  insertTable,
  setHeading,
  toggleLines,
  toggleWrap,
  type TextState,
} from '@/lib/markdown-edit';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type Edit = (state: TextState) => TextState;

interface Action {
  label: string;
  icon: LucideIcon;
  // The letter that goes with Ctrl (or Cmd), if it has one
  key?: string;
  edit: Edit;
}

// The formatting within a line
const INLINE: Action[] = [
  {
    label: 'Bold',
    icon: BoldIcon,
    key: 'b',
    edit: (s) => toggleWrap(s, '**', '**', 'bold text'),
  },
  {
    label: 'Italic',
    icon: ItalicIcon,
    key: 'i',
    edit: (s) => toggleWrap(s, '_', '_', 'italic text'),
  },
  {
    label: 'Underline',
    icon: UnderlineIcon,
    key: 'u',
    edit: (s) => toggleWrap(s, '<u>', '</u>', 'underlined text'),
  },
  {
    label: 'Strikethrough',
    icon: StrikethroughIcon,
    edit: (s) => toggleWrap(s, '~~', '~~', 'struck text'),
  },
  {
    label: 'Code',
    icon: CodeIcon,
    key: 'e',
    edit: (s) => toggleWrap(s, '`', '`', 'code'),
  },
];

const LINK: Action = {
  label: 'Link',
  icon: LinkIcon,
  key: 'k',
  edit: insertLink,
};

// The formatting of whole lines and blocks
const BLOCKS: Action[] = [
  {
    label: 'Bulleted list',
    icon: ListIcon,
    edit: (s) => toggleLines(s, 'bullet'),
  },
  {
    label: 'Numbered list',
    icon: ListOrderedIcon,
    edit: (s) => toggleLines(s, 'numbered'),
  },
  {
    label: 'Checklist',
    icon: ListChecksIcon,
    edit: (s) => toggleLines(s, 'task'),
  },
  { label: 'Quote', icon: QuoteIcon, edit: (s) => toggleLines(s, 'quote') },
  { label: 'Code block', icon: SquareCodeIcon, edit: insertCodeBlock },
  { label: 'Table', icon: TableIcon, edit: insertTable },
];

// Every action with a shortcut, for the field to look up a key press
export const SHORTCUTS = Object.fromEntries(
  [...INLINE, LINK].flatMap((action) =>
    action.key ? [[action.key, action.edit] as const] : []
  )
);

const HEADINGS = [
  { level: 0, label: 'Normal text' },
  { level: 2, label: 'Heading 2' },
  { level: 3, label: 'Heading 3' },
  { level: 4, label: 'Heading 4' },
] as const;

function ToolButton({
  label,
  shortcut,
  disabled,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          aria-label={label}
          aria-keyshortcuts={
            shortcut ? `Control+${shortcut.toUpperCase()}` : undefined
          }
          disabled={disabled}
          // Keeps the selection in the text while clicking
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && (
          <span className='ml-2 opacity-70'>Ctrl+{shortcut.toUpperCase()}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * The buttons above a Markdown text: formatting for what's selected, headings, links, pictures, lists and blocks.
 * Each hands an edit to `onEdit`, which the field applies to its text and selection.
 */
export function MarkdownToolbar({
  disabled,
  heading,
  onEdit,
  onPicture,
}: {
  disabled: boolean;
  // The heading level of the line the cursor is on, 0 for normal text
  heading: 0 | 2 | 3 | 4;
  onEdit: (edit: Edit) => void;
  onPicture: () => void;
}) {
  const button = (action: Action) => (
    <ToolButton
      key={action.label}
      label={action.label}
      shortcut={action.key}
      disabled={disabled}
      onClick={() => onEdit(action.edit)}
    >
      <action.icon />
    </ToolButton>
  );

  return (
    <div
      role='toolbar'
      aria-label='Formatting'
      className='flex flex-wrap items-center gap-0.5 rounded-lg border bg-muted/30 p-1'
    >
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                disabled={disabled}
                aria-label='Text style'
                onMouseDown={(event) => event.preventDefault()}
                // Wide enough for the longest style, so switching doesn't move the buttons after it
                className='w-32 justify-between'
              >
                <span className='flex items-center gap-1.5'>
                  <HeadingIcon className='size-3.5' />
                  {heading === 0 ? 'Normal' : `Heading ${heading}`}
                </span>
                <ChevronDownIcon className='size-3.5 text-muted-foreground' />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Text style</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align='start'
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuRadioGroup
            value={String(heading)}
            onValueChange={(value) =>
              onEdit((s) => setHeading(s, Number(value) as 0 | 2 | 3 | 4))
            }
          >
            {HEADINGS.map(({ level, label }) => (
              <DropdownMenuRadioItem key={level} value={String(level)}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation='vertical' className='mx-1 h-5!' />
      {INLINE.map(button)}
      <Separator orientation='vertical' className='mx-1 h-5!' />
      {button(LINK)}
      <ToolButton label='Picture' disabled={disabled} onClick={onPicture}>
        <ImageIcon />
      </ToolButton>
      <Separator orientation='vertical' className='mx-1 h-5!' />
      {BLOCKS.map(button)}
    </div>
  );
}
