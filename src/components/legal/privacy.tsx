'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  ArrowLeft,
  AtSignIcon,
  CircleQuestionMarkIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  GavelIcon,
  HandIcon,
  LanguagesIcon,
  ListEndIcon,
  MailIcon,
  PenBoxIcon,
  PhoneIcon,
  ScaleIcon,
  ShieldIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PrivacyContent({
  defaultLanguage,
}: {
  defaultLanguage: 'en' | 'de';
}) {
  const [language, setLanguage] = useState<'en' | 'de'>(defaultLanguage);

  const CONTENT = {
    en: {
      header: {
        title: 'Privacy Policy',
        description: 'Data protection according to GDPR',
        lastUpdated: 'Last updated: February 2026',
      },
      languageToggle: 'Read in German',
      notice: {
        title: 'Your Privacy Matters',
        description:
          'This is a portfolio website. We only collect data necessary for its operation.',
      },
      quickNavigation: {
        title: 'Quick Navigation',
        links: [
          { href: '#data-controller', label: 'Data Controller' },
          { href: '#data-retention', label: 'Data Retention' },
          { href: '#your-rights', label: 'Your Rights' },
          { href: '#questions', label: 'Questions' },
        ],
      },
      dataController: {
        title: 'Data Controller',
        description:
          'The responsible party for data processing on this website is:',
        name: 'Nikki Sophie Berthold',
        addressLine1: 'Friedrich-Karl-Straße 28',
        addressLine2: '32584 Löhne, Germany',
        email: 'Email: ',
        phone: 'Phone: ',
      },
      dataRetention: {
        title: 'Data Retention',
        description: 'We store your data as follows:',
      },
      yourRights: {
        title: 'Your Rights Under GDPR',
        description:
          'You have the following rights regarding your personal data:',
        rights: [
          {
            icon: EyeIcon,
            name: 'Right to Access',
            description: 'Request a copy of all data we store about you',
          },
          {
            icon: PenBoxIcon,
            name: 'Right to Rectification',
            description: 'Correct any inaccurate or incomplete data',
          },
          {
            icon: Trash2Icon,
            name: 'Right to Erasure',
            description: 'Request deletion of all your personal data',
          },
          {
            icon: DownloadIcon,
            name: 'Right to Data Portability',
            description: 'Receive your data in a machine-readable format',
          },
          {
            icon: HandIcon,
            name: 'Right to Object',
            description: 'Object to processing based on legitimate interests',
          },
          {
            icon: GavelIcon,
            name: 'Right to Complain',
            description:
              'Lodge a complaint with your data protection authority',
          },
        ],
        notice:
          'To exercise any of these rights, please contact us at {mail}. We will respond to your request within 30 days.',
      },
      questions: {
        title: 'Questions about Privacy?',
        description:
          'If you have questions about how we handle your data or want to exercise your rights, please contact us:',
        email: 'Email: ',
        phone: 'Phone: ',
        note: 'We typically respond to privacy-related inquiries within 30 days as required by GDPR.',
      },
    },
    de: {
      header: {
        title: 'Datenschutz-Erklärung',
        description: 'Datenschutz gemäß DSGVO',
        lastUpdated: 'Zuletzt aktualisiert: Februar 2026',
      },
      languageToggle: 'Read in English',
      notice: {
        title: 'Ihre Privatsphäre ist uns wichtig',
        description:
          'Dies ist eine Portfolio-Website. Wir erfassen nur Daten, die für den Betrieb notwendig sind.',
      },
      quickNavigation: {
        title: 'Schnellnavigation',
        links: [
          { href: '#data-controller', label: 'Datenverantwortlicher' },
          { href: '#data-retention', label: 'Speicherdauer' },
          { href: '#your-rights', label: 'Ihre Rechte' },
          { href: '#questions', label: 'Fragen' },
        ],
      },
      dataController: {
        title: 'Datenverantwortlicher',
        description:
          'Verantwortlicher für die Datenverarbeitung auf dieser Website ist:',
        name: 'Nikki Sophie Berthold',
        addressLine1: 'Friedrich-Karl-Straße 28',
        addressLine2: '32584 Löhne, Deutschland',
        email: 'E-Mail: ',
        phone: 'Telef.: ',
      },
      dataRetention: {
        title: 'Speicherdauer',
        description: 'Wir speichern Ihre Daten wie folgt:',
      },
      yourRights: {
        title: 'Ihre Rechte gemäß DSGVO',
        description:
          'Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:',
        rights: [
          {
            icon: EyeIcon,
            name: 'Recht auf Auskunft',
            description:
              'Fordern Sie eine Kopie aller Daten an, die wir über Sie speichern',
          },
          {
            icon: PenBoxIcon,
            name: 'Recht auf Berichtigung',
            description: 'Korrigieren Sie ungenaue oder unvollständige Daten',
          },
          {
            icon: Trash2Icon,
            name: 'Recht auf Löschung',
            description:
              'Fordern Sie die Löschung aller Ihrer personenbezogenen Daten an',
          },
          {
            icon: DownloadIcon,
            name: 'Recht auf Datenübertragbarkeit',
            description:
              'Erhalten Sie Ihre Daten in einem maschinenlesbaren Format',
          },
          {
            icon: HandIcon,
            name: 'Widerspruchsrecht',
            description:
              'Widersprechen Sie der Verarbeitung aufgrund berechtigter Interessen',
          },
          {
            icon: GavelIcon,
            name: 'Beschwerderecht',
            description:
              'Reichen Sie eine Beschwerde bei Ihrer zuständigen Datenschutzbehörde ein',
          },
        ],
        notice:
          'Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte unter {mail}. Wir werden Ihre Anfrage innerhalb von 30 Tagen beantworten.',
      },
      questions: {
        title: 'Fragen zum Datenschutz?',
        description:
          'Wenn Sie Fragen dazu haben, wie wir mit Ihren Daten umgehen oder Ihre Rechte ausüben möchten, kontaktieren Sie uns bitte:',
        email: 'E-Mail: ',
        phone: 'Telef.: ',
        note: 'Wir antworten auf datenschutzbezogene Anfragen in der Regel innerhalb von 30 Tagen, wie von der DSGVO vorgeschrieben.',
      },
    },
  };

  return (
    <div className='flex w-full flex-col items-center gap-4 tracking-tight'>
      <div className='flex w-full max-w-5xl flex-col items-center justify-between gap-2 p-4 sm:flex-row'>
        <div className='flex flex-col gap-2 pb-4 text-center sm:text-start'>
          <h1 className='text-4xl font-bold tracking-normal'>
            {CONTENT[language].header.title}
          </h1>
          <p className='text-muted-foreground text-lg text-balance'>
            {CONTENT[language].header.description}
          </p>
          <p className='text-muted-foreground text-sm'>
            {CONTENT[language].header.lastUpdated}
          </p>
        </div>
        <Button size='lg' asChild>
          <Link href={language === 'en' ? '/datenschutz' : '/privacy'}>
            <LanguagesIcon className='shrink-0' />
            {CONTENT[language].languageToggle}
          </Link>
        </Button>
      </div>

      <div className='bg-primary/20 border-primary flex w-full max-w-5xl flex-col gap-2 border p-4 sm:p-8'>
        <h2 className='flex items-center gap-2 text-xl font-semibold'>
          <ShieldIcon className='text-primary-text shrink-0' />
          {CONTENT[language].notice.title}
        </h2>
        <p className='text-balance'>{CONTENT[language].notice.description}</p>
      </div>

      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl'>
          <ListEndIcon className='shrink-0' />
          {CONTENT[language].quickNavigation.title}
        </h2>
        <ul className='text-muted-foreground *:hover:text-foreground grid list-inside grid-cols-1 gap-2 *:transition-all *:hover:translate-x-1 sm:grid-cols-2'>
          {CONTENT[language].quickNavigation.links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>
                {'>'} {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='data-controller'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <ShieldIcon className='shrink-0' />
          {CONTENT[language].dataController.title}
        </h2>
        <p>{CONTENT[language].dataController.description}</p>
        <div className='border p-4 text-sm sm:text-base'>
          <ul>
            <li className='pb-2'>{CONTENT[language].dataController.name}</li>
            <li className='text-muted-foreground'>
              {CONTENT[language].dataController.addressLine1}
            </li>
            <li className='text-muted-foreground pb-2'>
              {CONTENT[language].dataController.addressLine2}
            </li>
          </ul>
          <div className='flex flex-col gap-2'>
            <Link
              href='mailto:contact@niso.moe'
              className='flex items-center gap-2'
            >
              <AtSignIcon className='text-primary-text size-4 shrink-0' />
              {CONTENT[language].dataController.email} contact@niso.moe
            </Link>
            <Link href='tel:+4917646236314' className='flex items-center gap-2'>
              <PhoneIcon className='text-primary-text size-4 shrink-0' />
              {CONTENT[language].dataController.phone} +49 176 46236314
            </Link>
          </div>
        </div>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='data-retention'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <ClockIcon className='shrink-0' />
          {CONTENT[language].dataRetention.title}
        </h2>
        <p>{CONTENT[language].dataRetention.description}</p>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='your-rights'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <ScaleIcon className='shrink-0' />
          {CONTENT[language].yourRights.title}
        </h2>
        <p>{CONTENT[language].yourRights.description}</p>
        <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {CONTENT[language].yourRights.rights.map(
            ({ icon: Icon, name, description }) => (
              <li key={name} className='flex gap-4 border p-4'>
                <Icon className='text-primary-text shrink-0' />
                <div className='flex flex-col'>
                  <h3>{name}</h3>
                  <p className='text-muted-foreground'>{description}</p>
                </div>
              </li>
            ),
          )}
        </ul>
        <div className='border-primary bg-primary/20 flex flex-row gap-2 border p-4'>
          <MailIcon className='text-primary-text shrink-0' />
          <p>
            {CONTENT[language].yourRights.notice.replace(
              '{mail}',
              'contact@niso.moe',
            )}
          </p>
        </div>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='questions'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <CircleQuestionMarkIcon className='shrink-0' />
          {CONTENT[language].questions.title}
        </h2>
        <p>{CONTENT[language].questions.description}</p>
        <div className='flex flex-col gap-2 border p-4 text-sm sm:text-base'>
          <Link
            href='mailto:contact@niso.moe'
            className='flex items-center gap-2'
          >
            <AtSignIcon className='text-primary-text size-4 shrink-0' />
            {CONTENT[language].questions.email} contact@niso.moe
          </Link>
          <Link href='tel:+4917646236314' className='flex items-center gap-2'>
            <PhoneIcon className='text-primary-text size-4 shrink-0' />
            {CONTENT[language].questions.phone} +49 176 46236314
          </Link>
        </div>
        <p className='text-muted-foreground text-sm'>
          {CONTENT[language].questions.note}
        </p>
      </div>

      <Button size='lg' asChild>
        <Link href='/'>
          <ArrowLeft />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
