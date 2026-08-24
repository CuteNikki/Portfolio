'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';

import {
  CopyrightIcon,
  HouseIcon,
  LanguagesIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  ScaleIcon,
} from 'lucide-react';

import { LINKS } from '@/constants/links';
import { PERSONAL_DETAILS } from '@/constants/personal';

import { HomeButton } from '@/components/common/home-button';
import { EmailAndPhone } from '@/components/common/mail-phone-details';
import { ScrollToTopButton } from '@/components/common/scroll-top-buttont';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CONTENT = {
  en: {
    header: {
      title: 'Imprint',
      description: 'Legal information according to § 5 TMG',
    },
    languageToggle: 'Read in German',
    languageToggleIcon: <LanguagesIcon className='shrink-0' />,
    provider: {
      icon: <HouseIcon className='shrink-0' />,
      title: 'Provider',
      name: PERSONAL_DETAILS.fullName,
      addressLineOne: PERSONAL_DETAILS.address.lineOne,
      addressLineTwo: PERSONAL_DETAILS.address.lineTwo,
      country: PERSONAL_DETAILS.address.country,
    },
    contact: {
      icon: <MailIcon className='shrink-0' />,
      title: 'Contact',
    },
    liabilityContent: {
      icon: <ScaleIcon className='shrink-0' />,
      title: 'Liability for Content',
      paragraphs: [
        'As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Para. 1 TMG (German Telemedia Act).',
        'However, according to §§ 8 to 10 TMG, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
        'Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this respect is only possible from the time of knowledge of a specific infringement. Upon becoming aware of such violations, we will remove the content immediately.',
      ],
    },
    liabilityLinks: {
      icon: <LinkIcon className='shrink-0' />,
      title: 'Liability for Links',
      paragraphs: [
        'Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.',
        'The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of an infringement.',
        'If we become aware of any infringements, we will remove such links immediately.',
      ],
    },
    copyright: {
      icon: <CopyrightIcon className='shrink-0' />,
      title: 'Copyright',
      paragraphs: [
        'The content and works created by the site operators on these pages are subject to German copyright law. The duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.',
        'Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. If we become aware of any infringements, we will remove such content immediately.',
      ],
    },
  },
  de: {
    header: {
      title: 'Impressum',
      description: 'Rechtliche Angaben gemäß § 5 TMG',
    },
    languageToggle: 'Read in English',
    languageToggleIcon: <LanguagesIcon className='shrink-0' />,
    provider: {
      icon: <HouseIcon className='shrink-0' />,
      title: 'Anbieter',
      name: PERSONAL_DETAILS.fullName,
      addressLineOne: PERSONAL_DETAILS.address.lineOne,
      addressLineTwo: PERSONAL_DETAILS.address.lineTwo,
      country: PERSONAL_DETAILS.address.country,
    },
    contact: {
      icon: <MailIcon className='shrink-0' />,
      title: 'Kontakt',
    },
    liabilityContent: {
      icon: <ScaleIcon className='shrink-0' />,
      title: 'Haftung für Inhalte',
      paragraphs: [
        'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
        'Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
        'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.',
      ],
    },
    liabilityLinks: {
      icon: <LinkIcon className='shrink-0' />,
      title: 'Haftung für Links',
      paragraphs: [
        'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.',
        'Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.',
        'Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.',
      ],
    },
    copyright: {
      icon: <CopyrightIcon className='shrink-0' />,
      title: 'Urheberrecht',
      paragraphs: [
        'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
        'Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.',
      ],
    },
  },
};

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <CardTitle className='text-primary-text flex items-center gap-2'>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>{children}</CardContent>
    </Card>
  );
}

// 3. The Cleaned Up Main Component
export function ImprintContent({
  defaultLanguage,
}: {
  defaultLanguage: 'en' | 'de';
}) {
  const [language] = useState<'en' | 'de'>(defaultLanguage);
  const content = CONTENT[language];

  return (
    <div className='flex flex-col items-center gap-4 tracking-tight'>
      {/* Header */}
      <div className='flex w-full max-w-5xl flex-col items-start justify-between gap-2 p-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2 pb-4'>
          <h1 className='text-4xl font-bold tracking-normal'>
            {content.header.title}
          </h1>
          <p className='text-muted-foreground text-lg text-balance'>
            {content.header.description}
          </p>
        </div>
        <Button size='lg' asChild>
          <Link
            href={language === 'en' ? LINKS.impressum.url : LINKS.imprint.url}
          >
            {content.languageToggleIcon}
            {content.languageToggle}
          </Link>
        </Button>
      </div>

      {/* Provider */}
      <SectionCard icon={content.provider.icon} title={content.provider.title}>
        <h3>{content.provider.name}</h3>
        <div className='flex items-start gap-2'>
          <MapPinIcon className='text-primary-text size-4 shrink-0' />
          <ul className='text-sm sm:text-base'>
            <li>{content.provider.addressLineOne}</li>
            <li>{content.provider.addressLineTwo}</li>
            <li>{content.provider.country}</li>
          </ul>
        </div>
      </SectionCard>

      {/* Contact */}
      <SectionCard icon={content.contact.icon} title={content.contact.title}>
        <EmailAndPhone language={language} />
      </SectionCard>

      {/* Liability for Content */}
      <SectionCard
        icon={content.liabilityContent.icon}
        title={content.liabilityContent.title}
      >
        {content.liabilityContent.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </SectionCard>

      {/* Liability for Links */}
      <SectionCard
        icon={content.liabilityLinks.icon}
        title={content.liabilityLinks.title}
      >
        {content.liabilityLinks.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </SectionCard>

      {/* Copyright */}
      <SectionCard
        icon={content.copyright.icon}
        title={content.copyright.title}
      >
        {content.copyright.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </SectionCard>

      {/* Footer Nav */}
      <div className='flex flex-col items-center gap-2 sm:flex-row'>
        <HomeButton />
        <ScrollToTopButton />
      </div>
    </div>
  );
}
