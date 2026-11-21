'use client';

import dynamic from 'next/dynamic';
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { headingAt, insertBlock, type TextState } from '@/lib/markdown-edit';
import { cn } from '@/lib/utils';

import {
  MarkdownToolbar,
  SHORTCUTS,
} from '@/components/dashboard/shared/markdown-toolbar';
import { PictureDialog } from '@/components/dashboard/shared/picture-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// The preview's Markdown renderer and syntax highlighter are most of the editor's code, so they load the first time
// someone opens the Preview tab
const MarkdownViewer = dynamic(
  () =>
    import('@/components/dashboard/posts/markdown').then(
      (module) => module.MarkdownViewer
    ),
  {
    loading: () => <p className='text-muted-foreground'>Loading preview…</p>,
  }
);

// The post and project forms: the writing on the left, publishing and the rest in a column on the right that stays
// in view while scrolling. On narrower screens the column follows below.
export function FormColumns({
  main,
  side,
}: {
  main: React.ReactNode;
  side: React.ReactNode;
}) {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start'>
      <div className='flex min-w-0 flex-col gap-4'>{main}</div>
      <div className='flex min-w-0 flex-col gap-4 xl:sticky xl:top-20'>
        {side}
      </div>
    </div>
  );
}

// A card holding a group of fields
export function FormCard({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-4 sm:p-5',
        className
      )}
    >
      {title && (
        <header>
          <h2 className='text-[15px] font-bold'>{title}</h2>
          {description && (
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

// A field's label above its input, with an optional hint below
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className='text-sm font-medium'>
        {label}
      </label>
      {children}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  );
}

// The Markdown of a post or project, with a preview of how it reads on the site. A toolbar above formats what's
// selected and adds links, pictures, lists and the like; it stays in place, disabled, while the preview shows, so
// switching doesn't move the text.
export function MarkdownField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState('write');
  const [heading, setHeadingLevel] = useState<0 | 2 | 3 | 4>(0);
  const [picture, setPicture] = useState<{ file: File | null } | null>(null);
  const history = useHistory(value, onChange, textarea);

  const readHeading = () => {
    const field = textarea.current;
    if (field)
      setHeadingLevel(
        headingAt({
          value: field.value,
          start: field.selectionStart,
          end: field.selectionEnd,
        })
      );
  };

  // The heading menu follows the text as it changes, once the new text and selection are in
  useLayoutEffect(readHeading, [value]);

  // A picture file pasted or dropped into the text, if there is one
  const pictureIn = (files: FileList) =>
    [...files].find((file) => file.type.startsWith('image/')) ?? null;

  return (
    <FormCard>
      {/* The value goes to the form from here, since the textarea is gone while the preview shows */}
      <input type='hidden' name={id} value={value} />
      <Tabs value={tab} onValueChange={setTab} className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-3'>
          <label htmlFor={id} className='text-sm font-medium'>
            {label}
          </label>
          <TabsList className='grid w-44 grid-cols-2'>
            <TabsTrigger value='write'>Write</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>
        </div>

        <MarkdownToolbar
          disabled={tab !== 'write'}
          heading={heading}
          onEdit={history.apply}
          onPicture={() => setPicture({ file: null })}
        />

        <TabsContent value='write'>
          <Textarea
            ref={textarea}
            id={id}
            placeholder={placeholder}
            className='min-h-112 resize-y'
            value={value}
            onChange={(event) => history.type(event.target.value)}
            onSelect={() => {
              history.remember();
              readHeading();
            }}
            onKeyDown={(event) => {
              if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
              const key = event.key.toLowerCase();
              if (key === 'z' || key === 'y') {
                event.preventDefault();
                if (key === 'y' || event.shiftKey) history.redo();
                else history.undo();
              } else if (SHORTCUTS[key] && !event.shiftKey) {
                event.preventDefault();
                history.apply(SHORTCUTS[key]);
              }
            }}
            onPaste={(event) => {
              const file = pictureIn(event.clipboardData.files);
              if (!file) return;
              event.preventDefault();
              setPicture({ file });
            }}
            onDrop={(event) => {
              const file = pictureIn(event.dataTransfer.files);
              if (!file) return;
              event.preventDefault();
              setPicture({ file });
            }}
            required
          />
        </TabsContent>

        <TabsContent value='preview'>
          <div className='prose min-h-112 w-full max-w-none rounded-lg border border-input px-4 py-3 text-sm wrap-break-word dark:prose-invert catppuccin-macchiato:prose-invert'>
            {value ? (
              <MarkdownViewer content={value} />
            ) : (
              <p className='text-muted-foreground'>Nothing to preview yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <PictureDialog
        open={picture !== null}
        file={picture?.file ?? null}
        onOpenChange={(open) => {
          if (!open) setPicture(null);
        }}
        onInsert={(markdown) =>
          history.apply((state) => insertBlock(state, markdown))
        }
      />
    </FormCard>
  );
}

// Typing that comes this soon after the last is undone along with it
const TYPING_PAUSE_MS = 1000;
const HISTORY_LIMIT = 200;

/**
 * Undo and redo for a Markdown field. The browser's own undo doesn't see text changed from code, so the toolbar's
 * edits would break it; this keeps one history for typing and edits alike. Typing without a pause of a second is one
 * step. The browser's Undo and Redo menu items come here too.
 */
function useHistory(
  value: string,
  onChange: (value: string) => void,
  textarea: React.RefObject<HTMLTextAreaElement | null>
) {
  const undoStack = useRef<TextState[]>([]);
  const redoStack = useRef<TextState[]>([]);
  const lastTyped = useRef(0);
  // The selection before the latest change, which undoing it brings back
  const selection = useRef({ start: 0, end: 0 });
  // The selection to set once the new text has rendered
  const pending = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const field = textarea.current;
    if (!field || !pending.current) return;
    field.focus();
    field.setSelectionRange(pending.current.start, pending.current.end);
    selection.current = pending.current;
    pending.current = null;
  }, [value, textarea]);

  const current = (): TextState => {
    const field = textarea.current;
    return {
      value,
      start: field?.selectionStart ?? value.length,
      end: field?.selectionEnd ?? value.length,
    };
  };

  const push = (state: TextState) => {
    undoStack.current.push(state);
    if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift();
    redoStack.current = [];
  };

  const show = (state: TextState) => {
    pending.current = { start: state.start, end: state.end };
    onChange(state.value);
  };

  const apply = (edit: (state: TextState) => TextState) => {
    const before = current();
    const after = edit(before);
    if (after.value === before.value) {
      // Nothing changed, but the selection may have
      textarea.current?.setSelectionRange(after.start, after.end);
      return;
    }
    push(before);
    lastTyped.current = 0;
    show(after);
  };

  const type = (next: string) => {
    const now = Date.now();
    if (now - lastTyped.current > TYPING_PAUSE_MS) {
      push({ value, ...selection.current });
    }
    lastTyped.current = now;
    onChange(next);
  };

  const step = (
    from: React.RefObject<TextState[]>,
    to: React.RefObject<TextState[]>
  ) => {
    const state = from.current.pop();
    if (!state) return;
    to.current.push(current());
    lastTyped.current = 0;
    show(state);
  };

  const undo = () => step(undoStack, redoStack);
  const redo = () => step(redoStack, undoStack);

  // The browser's Edit menu and the text's right-click menu undo through here rather than their own history
  const onHistoryInput = useEffectEvent((event: InputEvent) => {
    if (event.inputType === 'historyUndo') {
      event.preventDefault();
      undo();
    } else if (event.inputType === 'historyRedo') {
      event.preventDefault();
      redo();
    }
  });
  useEffect(() => {
    const field = textarea.current;
    if (!field) return;
    const listener = (event: InputEvent) => onHistoryInput(event);
    field.addEventListener('beforeinput', listener);
    return () => field.removeEventListener('beforeinput', listener);
  }, [textarea]);

  const remember = () => {
    const field = textarea.current;
    if (field)
      selection.current = {
        start: field.selectionStart,
        end: field.selectionEnd,
      };
  };

  return { apply, type, undo, redo, remember };
}
