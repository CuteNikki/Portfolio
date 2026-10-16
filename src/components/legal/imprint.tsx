import {
  CopyrightIcon,
  HouseIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  ScaleIcon,
} from 'lucide-react';

import { LINKS } from '@/constants/links';
import { PERSONAL_DETAILS } from '@/constants/personal';

import { HomeButton } from '@/components/common/home-button';
import { EmailAndPhone } from '@/components/common/mail-phone-details';
import { ScrollToTopButton } from '@/components/common/scroll-top-button';
import { LegalHeader, LegalSection } from '@/components/legal/legal-parts';

const CONTENT = {
  en: {
    header: {
      title: 'Imprint',
      description: 'Legal information according to § 5 DDG',
    },
    languageToggle: 'Read in German',
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
        'As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Para. 1 DDG (German Digital Services Act).',
        'However, according to §§ 8 to 10 DDG, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
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
      description: 'Rechtliche Angaben gemäß § 5 DDG',
    },
    languageToggle: 'Read in English',
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
        'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
        'Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
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

export function ImprintContent({
  defaultLanguage,
}: {
  defaultLanguage: 'en' | 'de';
}) {
  const language = defaultLanguage;
  const content = CONTENT[language];

  return (
    // The page itself is marked English, so screen readers need to know when this part is German
    <div lang={language} className='flex w-full flex-col gap-10'>
      <LegalHeader
        eyebrow={language === 'en' ? 'Legal' : 'Rechtliches'}
        title={content.header.title}
        description={content.header.description}
        switchHref={language === 'en' ? LINKS.impressum.url : LINKS.imprint.url}
        switchLabel={content.languageToggle}
      />

      <div className='flex max-w-3xl flex-col gap-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <LegalSection
            icon={content.provider.icon}
            title={content.provider.title}
          >
            <div>
              <p className='text-foreground font-semibold'>
                {content.provider.name}
              </p>
              <p className='mt-1 flex items-start gap-2'>
                <MapPinIcon className='text-primary-text mt-0.5 size-4 shrink-0' />
                <span>
                  {content.provider.addressLineOne}
                  <br />
                  {content.provider.addressLineTwo}
                  <br />
                  {content.provider.country}
                </span>
              </p>
            </div>
          </LegalSection>

          <LegalSection
            icon={content.contact.icon}
            title={content.contact.title}
          >
            <EmailAndPhone language={language} />
          </LegalSection>
        </div>

        {[
          content.liabilityContent,
          content.liabilityLinks,
          content.copyright,
        ].map(({ icon, title, paragraphs }) => (
          <LegalSection key={title} icon={icon} title={title}>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </LegalSection>
        ))}

        <div data-reveal='' className='flex flex-wrap gap-2 pt-2'>
          <HomeButton quiet />
          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}
