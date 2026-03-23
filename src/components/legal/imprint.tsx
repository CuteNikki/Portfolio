'use client';

import Link from 'next/link';
import { useState } from 'react';

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

export function ImprintContent({
  defaultLanguage,
}: {
  defaultLanguage: 'en' | 'de';
}) {
  const [language] = useState<'en' | 'de'>(defaultLanguage);

  const CONTENT = {
    en: {
      header: {
        title: 'Imprint',
        description: 'Legal information according to § 5 TMG',
      },
      languageToggle: 'Read in German',
      provider: {
        title: 'Provider',
        name: PERSONAL_DETAILS.fullName,
        addressLineOne: PERSONAL_DETAILS.address.lineOne,
        addressLineTwo: PERSONAL_DETAILS.address.lineTwo,
        country: PERSONAL_DETAILS.address.country,
      },
      contact: {
        title: 'Contact',
      },
      liabilityContent: {
        title: 'Liability for Content',
        paragraphs: [
          'As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Para. 1 TMG (German Telemedia Act).',
          'However, according to §§ 8 to 10 TMG, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
          'Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this respect is only possible from the time of knowledge of a specific infringement. Upon becoming aware of such violations, we will remove the content immediately.',
        ],
      },
      liabilityLinks: {
        title: 'Liability for Links',
        paragraphs: [
          'Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.',
          'The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of an infringement.',
          'If we become aware of any infringements, we will remove such links immediately.',
        ],
      },
      copyright: {
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
      provider: {
        title: 'Anbieter',
        name: PERSONAL_DETAILS.fullName,
        addressLineOne: PERSONAL_DETAILS.address.lineOne,
        addressLineTwo: PERSONAL_DETAILS.address.lineTwo,
        country: PERSONAL_DETAILS.address.country,
      },
      contact: {
        title: 'Kontakt',
      },
      liabilityContent: {
        title: 'Haftung für Inhalte',
        paragraphs: [
          'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
          'Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
          'Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.',
        ],
      },
      liabilityLinks: {
        title: 'Haftung für Links',
        paragraphs: [
          'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.',
          'Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.',
          'Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.',
        ],
      },
      copyright: {
        title: 'Urheberrecht',
        paragraphs: [
          'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
          'Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.',
        ],
      },
    },
  };

  return (
    <div className='flex flex-col items-center gap-4 tracking-tight'>
      <div className='flex w-full max-w-5xl flex-col items-start justify-between gap-2 p-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2 pb-4'>
          <h1 className='text-4xl font-bold tracking-normal'>
            {CONTENT[language].header.title}
          </h1>
          <p className='text-muted-foreground text-lg text-balance'>
            {CONTENT[language].header.description}
          </p>
        </div>
        <Button size='lg' asChild>
          <Link
            href={language === 'en' ? LINKS.imprint.url : LINKS.impressum.url}
          >
            <LanguagesIcon className='shrink-0' />
            {CONTENT[language].languageToggle}
          </Link>
        </Button>
      </div>

      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <HouseIcon className='shrink-0' /> {CONTENT[language].provider.title}
        </h2>
        <h3>{CONTENT[language].provider.name}</h3>
        <div className='flex items-start gap-2'>
          <MapPinIcon className='text-primary-text size-4 shrink-0' />
          <ul className='text-sm sm:text-base'>
            <li>{CONTENT[language].provider.addressLineOne}</li>
            <li>{CONTENT[language].provider.addressLineTwo}</li>
            <li>{CONTENT[language].provider.country}</li>
          </ul>
        </div>
      </div>

      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <MailIcon className='shrink-0' />
          {CONTENT[language].contact.title}
        </h2>
        <EmailAndPhone language={language} />
      </div>
      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <ScaleIcon className='shrink-0' />
          {CONTENT[language].liabilityContent.title}
        </h2>
        {CONTENT[language].liabilityContent.paragraphs.map(
          (paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ),
        )}
      </div>

      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <LinkIcon className='shrink-0' />
          {CONTENT[language].liabilityLinks.title}
        </h2>
        {CONTENT[language].liabilityLinks.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h2 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <CopyrightIcon className='shrink-0' />
          {CONTENT[language].copyright.title}
        </h2>
        {CONTENT[language].copyright.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className='flex flex-col items-center gap-2 sm:flex-row'>
        <HomeButton />
        <ScrollToTopButton />
      </div>
    </div>
  );
}
