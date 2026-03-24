import { IconType, SiDiscord } from '@icons-pack/react-simple-icons';
import { GithubIcon, LinkedinIcon, LucideIcon, MailIcon } from 'lucide-react';

export interface SocialLink {
  icon: IconType | LucideIcon;
  platform: string;
  url: string;
}

export interface CareerEntry {
  from: Date;
  to: Date | 'Present';
  showDays?: boolean;
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface EducationEntry {
  from: Date;
  to: Date | 'Present';
  title: string;
  school: string;
  location: string;
  description: string;
}

export const PERSONAL_DETAILS = {
  firstName: 'Nikki',
  middleName: 'Sophie',
  lastName: 'Berthold',
  title: 'Developer',
  description:
    'I do full-stack development and design, focusing on the intersection of code and user experience. I build fast, accessible, and well-structured applications from the ground up.',
  dateOfBirth: new Date('2004-09-26'),
  get age() {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  },
  get fullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  },
  email: 'contact@niso.moe',
  get emailLink() {
    return `mailto:${this.email}`;
  },
  phone: '+49 176 46236314',
  get phoneLink() {
    return `tel:${this.phone.replace(/[^0-9+]/g, '')}`;
  },
  address: {
    street: 'Friedrich-Karl-Straße',
    houseNumber: '28',
    city: 'Löhne',
    zip: '32584',
    country: 'Germany',
    flag: '🇩🇪',
    get lineOne() {
      return `${this.street} ${this.houseNumber}`;
    },
    get lineTwo() {
      return `${this.zip} ${this.city}`;
    },
    get lineTwoWithCountry() {
      return `${this.zip} ${this.city}, ${this.country}`;
    },
  },
  get socials(): readonly SocialLink[] {
    return [
      {
        icon: GithubIcon,
        platform: 'GitHub',
        url: 'https://github.com/CuteNikki',
      },
      {
        icon: LinkedinIcon,
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/nikki-sophie-berthold/',
      },
      {
        icon: MailIcon,
        platform: 'Mail',
        url: this.emailLink,
      },
      {
        icon: SiDiscord,
        platform: 'Discord',
        url: 'https://discord.com/users/303142922780672013',
      },
    ] as const;
  },

  get education(): readonly EducationEntry[] {
    return [
      {
        from: new Date('2024-09'),
        to: new Date('2027-08'),
        title: 'Student',
        school: 'Carl-Severing-Berufskolleg',
        location: 'Bielefeld, Germany',
        description:
          'Pursuing vocational education in software development, focusing on practical skills and theoretical knowledge.',
      },
      {
        from: new Date('2015-09'),
        to: new Date('2021-08'),
        title: 'Student',
        school: 'Bertolt-Brecht-Gesamtschule',
        location: 'Löhne, Germany',
        description:
          'Completed secondary school education with a focus on science and technology subjects.',
      },
      {
        from: new Date('2011-09'),
        to: new Date('2015-08'),
        title: 'Student',
        school: 'Ev. Grundschule Obernbeck',
        location: 'Löhne, Germany',
        description:
          'Completed primary/elementary school education, laying the foundation for further academic pursuits.',
      },
      {
        from: new Date('2008-09'),
        to: new Date('2011-08'),
        title: 'Kindergartner',
        school: 'Ev. Kindergarten Die Arche',
        location: 'Löhne, Germany',
        description:
          'Attended kindergarten, developing social skills and preparing for formal education.',
      },
    ] as const;
  },
  get career(): readonly CareerEntry[] {
    return [
      {
        from: new Date('2026-02-04'),
        to: 'Present',
        title: 'Java Developer',
        company: 'TheVace',
        location: 'Remote',
        description:
          'Developing and maintaining backend systems and plugins for TheVace Minecraft Network.',
      },
      {
        from: new Date('2024-08'),
        to: 'Present',
        title: 'Application Developer',
        company: 'Prodress Software',
        location: 'Bielefeld, Germany',
        description:
          'Developing and maintaining software applications, collaborating with cross-functional teams to deliver high-quality products.',
      },
      {
        from: new Date('2022-09-17'),
        to: new Date('2022-09-21'),
        title: 'Application Developer',
        company: 'Mittwald CM Service',
        location: 'Espelkamp, Germany',
        description:
          'Completed an internship, gaining hands-on experience in application development and understanding industry practices.',
      },
      {
        from: new Date('2015-09'),
        to: 'Present',
        title: 'Freelancer',
        company: 'Self-Employed',
        location: 'Remote',
        description:
          'Working on various freelance projects, building web applications and more for clients across different industries.',
      },
    ] as const;
  },
} as const;
