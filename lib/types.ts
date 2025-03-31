import { ReactNode } from 'react';

export type Route = {
  name: string;
  href: string;
};

export type Career = {
  from: string;
  to: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

export type Education = {
  from: string;
  to: string;
  title: string;
  school: string;
  location: string;
  description: string;
};

export type NameIcon = {
  name: string;
  icon: ReactNode;
};

export type Skill = {
  text: string;
  icon: ReactNode;
};

export type Social = {
  name: string;
  url: string;
  icon: ReactNode;
};

export type Project = {
  name: string;
  description: string;
  tags: string[];
  technologies: {
    name: string;
    icon: ReactNode;
  }[];
  links: {
    href: string;
    label: string;
    icon?: ReactNode;
  }[];
  icon: string;
  image: string;
};
