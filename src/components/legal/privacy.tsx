'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  CheckIcon,
  ChevronRightIcon,
  CircleQuestionMarkIcon,
  ClockIcon,
  CookieIcon,
  Disc3Icon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  GavelIcon,
  HandIcon,
  InfoIcon,
  KeyRoundIcon,
  LanguagesIcon,
  ListEndIcon,
  LockIcon,
  LucideIcon,
  MailIcon,
  PenBoxIcon,
  ScaleIcon,
  ServerIcon,
  Share2Icon,
  ShieldIcon,
  Trash2Icon,
  UserStarIcon,
} from 'lucide-react';

import { PERSONAL_DETAILS } from '@/constants/personal';

import { HomeButton } from '@/components/common/home-button';
import { EmailAndPhone } from '@/components/common/mail-phone-details';
import { ScrollToTopButton } from '@/components/common/scroll-top-buttont';
import { Button } from '@/components/ui/button';

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
        lastUpdated: 'Last updated: March 2026',
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
          { href: '#discord-oauth-login', label: 'Discord OAuth Login' },
          { href: '#data-retention', label: 'Data Retention' },
          { href: '#server-logs', label: 'Server Logs' },
          { href: '#data-security', label: 'Data Security' },
          { href: '#cookies-and-sessions', label: 'Cookies & Sessions' },
          { href: '#your-rights', label: 'Your Rights' },
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
      discordOAuthLogin: {
        title: 'Discord OAuth Login',
        description:
          'This website uses Discord OAuth for authentication. When you log in with Discord, we receive and store the following information:',
        data: [
          {
            title: 'Discord User ID',
            description:
              'Your unique Discord identifier (for account identification)',
          },
          {
            title: 'Username',
            description: 'Your Discord username (for display)',
          },
          {
            title: 'Avatar URL',
            description: 'Your profile picture (for display)',
          },
          {
            title: 'Email Address',
            description:
              'Your Discord Email (for account recovery and communication)',
          },
        ],
        purpose: {
          title: 'Purpose:',
          description: 'Authentication and communication.',
        },
        legalBasis: {
          title: 'Legal basis:',
          description:
            'Art. 6 para. 1 lit. a GDPR  (necessary for contract fulfillment - providing the service you requested).',
        },
        dataSharing: {
          title: 'Data Sharing:',
          description:
            'This authentication process is handled by Discord. By logging in, you also agree to ',
          privacyPolicy: "Discord's Privacy Policy",
          url: 'https://discord.com/privacy',
        },
      },
      serverLogs: {
        title: 'Server Logs',
        description:
          'Our web server automatically collects and temporarily stores the following technical information when you visit our website:',
        data: [
          'IP Address (anonymized)',
          'Date and Time of Access',
          'Requested Page/Resource',
          'HTTP Status Code',
          'Browser Type and Version',
          'Operating System',
          'Referrer URL (previously visited page)',
        ],
        purpose: {
          title: 'Purpose:',
          description:
            'Security analysis, debugging errors, and ensuring the stability and availability of our service.',
        },
        legalBasis: {
          title: 'Legal basis:',
          description:
            'Art. 6 para. 1 lit. f GDPR (legitimate interest in ensuring the security and proper functioning of our service).',
        },
        retention: {
          title: 'Retention:',
          description:
            'These logs are automatically deleted after 30 days or when overwritten by new logs.',
        },
      },
      dataRetention: {
        title: 'Data Retention',
        description: 'We store your data as follows:',
        data: [
          {
            title: 'Account Data (Discord OAuth):',
            description:
              'Stored as long as your account exists. You can request deletion at any time by contacting us or deleting your account.',
          },
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
      cookiesAndSessions: {
        title: 'Cookies & Session Storage',
        description:
          'We use only essential cookies necessary for the website to function. No tracking, analytics, or advertising cookies.',
        cookies: [
          {
            icon: KeyRoundIcon,
            title: 'Session Cookie',
            essential: '(Essential)',
            description:
              'Keeps you logged in and maintains your session state while browsing the site.',
            duration: 'Duration: Session (cleared when browser is closed)',
          },
          // {
          //   icon: CrosshairIcon,
          //   title: 'CSRF Token',
          //   essential: '(Essential)',
          //   description:
          //     'Security token to protect against cross-site request forgery attacks.',
          //   duration: 'Duration: Session',
          // },
        ] as Array<{
          icon: LucideIcon;
          title: string;
          essential: string;
          description: string;
          duration: string;
        }>,
        note: 'These cookies are technically necessary for the operation of the website and cannot be disabled. We do not use any tracking, analytics, or advertising cookies.',
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
      thirdPartyServices: {
        title: 'Third-Party Services',
        services: [
          {
            icon: Disc3Icon,
            name: 'Discord Inc.',
            description:
              "We use Discord's OAuth 2.0 API for authentication and Discord's API. When you use this site, your data is processed by Discord according to their privacy policy.",
            sharedTitle: 'Data shared with Discord:',
            sharedData:
              'When you log in, Discord processes your authentication requests according to their terms.',
            privacyPolicy: "View Discord's Privacy Policy",
            url: 'https://discord.com/privacy',
          },
        ],
        notice:
          'We do not use any analytics services (like Google Analytics), advertising networks, or other third-party tracking services. Discord is the only third-party service we integrate with.',
      },
      dataSecurity: {
        title: 'Data Security',
        description:
          'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse:',
        measures: [
          'HTTPS/TLS encryption for all connections',
          'Regular security updates',
          'Protected database access',
          'Firewall and intrusion detection',
          'Regular automated backups',
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
        lastUpdated: 'Zuletzt aktualisiert: März 2026',
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
          { href: '#discord-oauth-login', label: 'Discord OAuth Login' },
          { href: '#data-retention', label: 'Speicherdauer' },
          { href: '#server-logs', label: 'Server-Logs' },
          { href: '#data-security', label: 'Datensicherheit' },
          { href: '#cookies-and-sessions', label: 'Cookies & Sessions' },
          { href: '#your-rights', label: 'Ihre Rechte' },
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
      discordOAuthLogin: {
        title: 'Discord OAuth Login',
        description:
          'Diese Seite verwendet Discord OAuth zur Authentifizierung. Wenn Sie sich mit Discord anmelden, erhalten und speichern wir folgende Informationen:',
        data: [
          {
            title: 'Discord User ID',
            description:
              'Ihre eindeutige Discord-Kennung (zur Identifikation des Accounts)',
          },
          {
            title: 'Benutzername',
            description: 'Ihr Discord-Benutzername (zur Anzeige)',
          },
          {
            title: 'Avatar-URL',
            description: 'Ihr Profilbild (zur Anzeige)',
          },
          {
            title: 'E-Mail-Adresse',
            description:
              'Ihre bei Discord hinterlegte E-Mail (zur Kontowiederherstellung und Kommunikation)',
          },
        ],
        purpose: {
          title: 'Zweck:',
          description: 'Authentifizierung und Kommunikation.',
        },
        legalBasis: {
          title: 'Rechtsgrundlage:',
          description:
            'Art. 6 Abs. 1 lit. a DSGVO (erforderlich zur Vertragserfüllung – Bereitstellung des von Ihnen angeforderten Dienstes).',
        },
        dataSharing: {
          title: 'Datenweitergabe:',
          description:
            'Dieser Authentifizierungsprozess wird von Discord abgewickelt. Durch die Anmeldung stimmen Sie auch zu: ',
          privacyPolicy: 'Datenschutzerklärung von Discord',
          url: 'https://discord.com/privacy',
        },
      },
      serverLogs: {
        title: 'Server-Logs',
        description:
          'Unser Webserver erfasst und speichert automatisch und temporär folgende technische Informationen, wenn Sie unsere Website besuchen:',
        data: [
          'IP-Adresse (anonymisiert)',
          'Datum und Uhrzeit des Zugriffs',
          'Angeforderte Seite/Ressource',
          'HTTP-Statuscode',
          'Browsertyp und -version',
          'Betriebssystem',
          'Referrer URL (vorher besuchte Seite)',
        ],
        purpose: {
          title: 'Zweck:',
          description:
            'Sicherheitsanalyse, Fehlerbehebung und Gewährleistung der Stabilität und Verfügbarkeit unseres Dienstes.',
        },
        legalBasis: {
          title: 'Rechtsgrundlage:',
          description:
            'Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an der Gewährleistung der Sicherheit und des ordnungsgemäßen Betriebs unseres Dienstes).',
        },
        retention: {
          title: 'Speicherdauer:',
          description:
            'Diese Logs werden nach 30 Tagen automatisch gelöscht oder überschrieben.',
        },
      },
      dataRetention: {
        title: 'Speicherdauer',
        description: 'Wir speichern Ihre Daten wie folgt:',
        data: [
          {
            title: 'Kontodaten (Discord OAuth):',
            description:
              'Gespeichert, solange Ihr Konto besteht. Sie können die Löschung jederzeit beantragen, indem Sie uns kontaktieren oder Ihr Konto löschen.',
          },
          {
            title: 'Kontaktformular-Einsendungen:',
            description:
              'Gespeichert bis die Anfrage bearbeitet ist oder maximal 2 Jahre.',
          },
          {
            title: 'Server-Logs:',
            description:
              'Automatisch gelöscht nach 30 Tagen oder wenn sie durch neue Logs aufgrund der Speicherrotation überschrieben werden.',
          },
        ],
      },
      cookiesAndSessions: {
        title: 'Cookies & Session-Speicher',
        description:
          'Wir verwenden nur essentielle Cookies, die für das Funktionieren der Website notwendig sind. Keine Tracking-, Analyse- oder Werbe-Cookies.',
        cookies: [
          {
            icon: KeyRoundIcon,
            title: 'Session-Cookie',
            essential: '(Essentiell)',
            description:
              'Hält Sie eingeloggt und behält Ihren Sitzungsstatus bei, während Sie unsere Website nutzen.',
            duration:
              'Dauer: Sitzung (wird beim Schließen des Browsers gelöscht)',
          },
          // {
          //   icon: CrosshairIcon,
          //   title: 'CSRF-Token',
          //   essential: '(Essentiell)',
          //   description:
          //     'Sicherheitstoken zum Schutz vor Cross-Site-Request-Forgery-Angriffen.',
          //   duration: 'Dauer: Sitzung',
          // },
        ] as Array<{
          icon: LucideIcon;
          title: string;
          essential: string;
          description: string;
          duration: string;
        }>,
        note: 'Diese Cookies sind technisch notwendig für den Betrieb der Website und können nicht deaktiviert werden. Wir verwenden keine Tracking-, Analyse- oder Werbe-Cookies.',
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
      thirdPartyServices: {
        title: 'Drittanbieter-Dienste',
        services: [
          {
            icon: Disc3Icon,
            name: 'Discord Inc.',
            description:
              'Wir verwenden Discords OAuth 2.0 API für die Authentifizierung und Discords API. Wenn Sie diese Seite nutzen, werden Ihre Daten von Discord gemäß deren Datenschutzrichtlinie verarbeitet.',
            sharedTitle: 'Mit Discord geteilte Daten:',
            sharedData:
              'Wenn Sie sich anmelden, verarbeitet Discord Ihre Authentifizierungsanfragen gemäß deren Bedingungen.',
            privacyPolicy: 'Datenschutzerklärung von Discord',
            url: 'https://discord.com/privacy',
          },
        ],
        notice:
          'Wir verwenden keine Analyse-Tools (wie Google Analytics), Werbenetzwerke oder andere Tracking-Dienste von Drittanbietern. Discord ist der einzige Drittanbieterdienst, mit dem wir integrieren.',
      },
      dataSecurity: {
        title: 'Datensicherheit',
        description:
          'Wir setzen geeignete technische und organisatorische Maßnahmen ein, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen:',
        measures: [
          'HTTPS/TLS-Verschlüsselung für alle Verbindungen',
          'Regelmäßige Sicherheitsupdates',
          'Geschützter Datenbankzugriff',
          'Firewall und Eindringungserkennung',
          'Regelmäßige automatisierte Backups',
        ],
        note: 'Trotz dieser Maßnahmen ist keine Übertragungsmethode über das Internet oder elektronische Speicherung zu 100% sicher. Obwohl wir uns bemühen, Ihre Daten zu schützen, können wir keine absolute Sicherheit garantieren.',
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
      <div className='flex w-full max-w-5xl flex-col items-start justify-between gap-2 p-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2 pb-4'>
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
        <p>{CONTENT[language].notice.description}</p>
      </div>

      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl'>
          <ListEndIcon className='shrink-0' />
          {CONTENT[language].quickNavigation.title}
        </h2>
        <ul className='text-muted-foreground *:hover:text-foreground grid list-inside grid-cols-1 gap-2 *:transition-all *:hover:translate-x-1 sm:grid-cols-2'>
          {CONTENT[language].quickNavigation.links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className='flex flex-row items-center gap-2'>
                <ChevronRightIcon className='size-4 shrink-0' /> {label}
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
          <UserStarIcon className='shrink-0' />
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
        id='discord-oauth-login'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <Disc3Icon className='shrink-0' />
          {CONTENT[language].discordOAuthLogin.title}
        </h2>
        <p>{CONTENT[language].discordOAuthLogin.description}</p>
        <ul className='flex flex-col gap-2 border p-4'>
          {CONTENT[language].discordOAuthLogin.data.map(
            ({ title, description }) => (
              <li key={title} className='flex flex-row items-center gap-4'>
                <CheckIcon className='text-primary-text shrink-0' />
                <p className='text-muted-foreground'>
                  <b className='text-foreground whitespace-nowrap'>{title}</b>
                  {' - '}
                  {description}
                </p>
              </li>
            ),
          )}
        </ul>
        <p>
          <b>{CONTENT[language].discordOAuthLogin.purpose.title} </b>
          {CONTENT[language].discordOAuthLogin.purpose.description}
        </p>
        <p>
          <b>{CONTENT[language].discordOAuthLogin.legalBasis.title} </b>
          {CONTENT[language].discordOAuthLogin.legalBasis.description}
        </p>
        <p>
          <b>{CONTENT[language].discordOAuthLogin.dataSharing.title} </b>
          {CONTENT[language].discordOAuthLogin.dataSharing.description}
          <Link
            href={CONTENT[language].discordOAuthLogin.dataSharing.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-primary-text underline underline-offset-4 transition-colors'
          >
            {CONTENT[language].discordOAuthLogin.dataSharing.privacyPolicy}
          </Link>
        </p>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='server-logs'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <ServerIcon className='shrink-0' />
          {CONTENT[language].serverLogs.title}
        </h2>
        <p>{CONTENT[language].serverLogs.description}</p>
        <ul className='marker:text-primary-text flex list-outside list-disc flex-col gap-2 border p-4 pl-8 marker:text-lg'>
          {CONTENT[language].serverLogs.data.map((text) => (
            <li key={text}>
              <p className='text-muted-foreground'>{text}</p>
            </li>
          ))}
        </ul>
        <p>
          <b>{CONTENT[language].serverLogs.purpose.title} </b>
          {CONTENT[language].serverLogs.purpose.description}
        </p>
        <p>
          <b>{CONTENT[language].serverLogs.legalBasis.title} </b>
          {CONTENT[language].serverLogs.legalBasis.description}
        </p>
        <p>
          <b>{CONTENT[language].serverLogs.retention.title} </b>
          {CONTENT[language].serverLogs.retention.description}
        </p>
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
              <li key={title}>
                <h3>{title}</h3>
                <p className='text-muted-foreground'>{description}</p>
              </li>
            ),
          )}
        </ul>
      </div>

      <div
        className='flex w-full max-w-5xl scroll-m-20 flex-col gap-4 border p-4 sm:p-8'
        id='cookies-and-sessions'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <CookieIcon className='shrink-0' />
          {CONTENT[language].cookiesAndSessions.title}
        </h2>
        <p>{CONTENT[language].cookiesAndSessions.description}</p>
        <ul className='flex flex-col gap-2'>
          {CONTENT[language].cookiesAndSessions.cookies.map(
            ({ description, title, essential, duration, icon: Icon }) => (
              <li key={title} className='border p-4'>
                <div className='flex flex-col gap-2'>
                  <h3 className='flex gap-2'>
                    <Icon className='text-primary-text shrink-0' />
                    {title} {essential}
                  </h3>
                  <p className='text-muted-foreground'>{description}</p>
                  <p className='text-muted-foreground text-sm'>{duration}</p>
                </div>
              </li>
            ),
          )}
        </ul>
        <div className='border-primary bg-primary/20 flex flex-row gap-2 border p-4'>
          <InfoIcon className='text-primary-text shrink-0' />
          <p>{CONTENT[language].cookiesAndSessions.note}</p>
        </div>
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
        id='third-party-services'
      >
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <Share2Icon className='shrink-0' />
          {CONTENT[language].thirdPartyServices.title}
        </h2>
        {CONTENT[language].thirdPartyServices.services.map(
          ({
            icon: Icon,
            name,
            description,
            sharedData,
            sharedTitle,
            privacyPolicy,
            url,
          }) => (
            <div key={name} className='flex flex-col gap-2 border p-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <Icon className='text-primary-text shrink-0' />
                {name}
              </h3>
              <p className='text-muted-foreground'>{description}</p>
              <p className='text-muted-foreground'>
                <b className='text-foreground'>{sharedTitle} </b>
                {sharedData}
              </p>
              <Link
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary-text flex items-center gap-2 text-sm underline underline-offset-4 transition-colors'
              >
                {privacyPolicy}
                <ExternalLinkIcon className='size-4 shrink-0' />
              </Link>
            </div>
          ),
        )}
        <p>{CONTENT[language].thirdPartyServices.notice}</p>
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

      <div className='flex flex-col items-center gap-2 sm:flex-row'>
        <HomeButton />
        <ScrollToTopButton />
      </div>
    </div>
  );
}
