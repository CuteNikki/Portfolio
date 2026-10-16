import type { Project } from '@/generated/prisma/browser';

import { Field } from '@/components/dashboard/shared/form-parts';
import { Input } from '@/components/ui/input';

// A project's tags, technologies and links, empty for a new project
export function ProjectDetailFields({ project }: { project?: Project }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <Field label='Tags' htmlFor='tags' hint='Separated by commas'>
        <Input
          id='tags'
          name='tags'
          placeholder='Web app, Open source'
          defaultValue={project?.tags.join(', ')}
        />
      </Field>
      <Field
        label='Technologies'
        htmlFor='technologies'
        hint='Separated by commas'
      >
        <Input
          id='technologies'
          name='technologies'
          placeholder='Next.js, PostgreSQL'
          defaultValue={project?.technologies.join(', ')}
        />
      </Field>
      <Field label='Repository' htmlFor='repository'>
        <Input
          id='repository'
          name='repository'
          inputMode='url'
          placeholder='https://github.com/username/repository'
          defaultValue={project?.repository ?? undefined}
        />
      </Field>
      <Field label='Website' htmlFor='website'>
        <Input
          id='website'
          name='website'
          inputMode='url'
          placeholder='https://example.com'
          defaultValue={project?.website ?? undefined}
        />
      </Field>
    </div>
  );
}
