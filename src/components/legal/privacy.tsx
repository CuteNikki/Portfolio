'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  ArrowLeft,
  CheckIcon,
  CircleQuestionMarkIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  GavelIcon,
  HandIcon,
  LanguagesIcon,
  ListEndIcon,
  LockIcon,
  MailIcon,
  PenBoxIcon,
  ScaleIcon,
  ShieldIcon,
  Trash2Icon,
} from 'lucide-react';

import { EmailAndPhone } from '@/components/common/contact';
import { Button } from '@/components/ui/button';

import { PERSONAL_DETAILS } from '@/constants/personal';

export function PrivacyContent({
  defaultLanguage,
}: {
  defaultLanguage: 'en' | 'de';
}) {
  const [language] = useState<'en' | 'de'>(defaultLanguage);

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
          { href: '#data-security', label: 'Data Security' },
          { href: '#questions', label: 'Questions' },
        ],
      },
      dataController: {
        title: 'Data Controller',
        description:
          'The responsible party for data processing on this website is:',
        name: PERSONAL_DETAILS.fullName,
        addressLine1: PERSONAL_DETAILS.address.lineOne,
        addressLine2: PERSONAL_DETAILS.address.lineTwoWithCountry,
      },
      dataRetention: {
        title: 'Data Retention',
        description: 'We store your data as follows:',
        data: [
          {
            title: 'Contact Form Submissions:',
            description:
              'Stored until the inquiry is resolved or for a maximum of 2 years.',
          },
          {
            title: 'Server Logs:',
            description:
              'Automatically deleted after 30 days or when overwritten by new logs due to storage rotation.',
          },
        ],
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
      dataSecurity: {
        title: 'Data Security',
        description:
          'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse:',
        measures: [
          'HTTPS/TLS encryption for all connections',
          'Regular security updates',
        ],
        note: 'Despite these measures, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.',
      },
      questions: {
        title: 'Questions about Privacy?',
        description:
          'If you have questions about how we handle your data or want to exercise your rights, please contact us:',
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
          { href: '#data-security', label: 'Datensicherheit' },
          { href: '#questions', label: 'Fragen' },
        ],
      },
      dataController: {
        title: 'Datenverantwortlicher',
        description:
          'Verantwortlicher für die Datenverarbeitung auf dieser Website ist:',
        name: PERSONAL_DETAILS.fullName,
        addressLine1: PERSONAL_DETAILS.address.lineOne,
        addressLine2: PERSONAL_DETAILS.address.lineTwoWithCountry,
      },
      dataRetention: {
        title: 'Speicherdauer',
        description: 'Wir speichern Ihre Daten wie folgt:',
        data: [
          {
            title: 'Kontaktformular-Einsendungen:',
            description:
              'Gespeichert bis die Anfrage bearbeitet ist oder maximal 2 Jahre.',
          },
        ],
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

      dataSecurity: {
        title: 'Data Security',
        description:
          'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse:',
        measures: [
          'HTTPS/TLS encryption for all connections',
          'Regular security updates',
        ],
        note: 'Despite these measures, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.',
      },
      questions: {
        title: 'Fragen zum Datenschutz?',
        description:
          'Wenn Sie Fragen dazu haben, wie wir mit Ihren Daten umgehen oder Ihre Rechte ausüben möchten, kontaktieren Sie uns bitte:',
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
          <EmailAndPhone language={language} />
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
        <ul className='marker:text-primary-text flex list-outside list-disc flex-col gap-2 border p-4 pl-8 marker:text-lg'>
          {CONTENT[language].dataRetention.data.map(
            ({ title, description }) => (
              <li key={title} className=''>
                <h3>{title}</h3>
                <p className='text-muted-foreground'>{description}</p>
              </li>
            ),
          )}
        </ul>
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
              PERSONAL_DETAILS.email,
            )}
          </p>
        </div>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='data-security'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <LockIcon className='shrink-0' />
          {CONTENT[language].dataSecurity.title}
        </h2>
        <p>{CONTENT[language].dataSecurity.description}</p>
        <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {CONTENT[language].dataSecurity.measures.map((text) => (
            <li key={text} className='flex items-center gap-4'>
              <CheckIcon className='text-primary-text shrink-0' />
              <p className='text-muted-foreground'>{text}</p>
            </li>
          ))}
        </ul>
        <p className='text-sm'>{CONTENT[language].dataSecurity.note}</p>
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
        <div className='border p-4'>
          <EmailAndPhone language={language} />
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
