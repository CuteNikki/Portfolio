'use client';

import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  Brain,
  Briefcase,
  Calendar,
  Code,
  Copy,
  Database,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Laptop,
  Mail,
  Twitter,
  Users,
  Wrench,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Education and Career interfaces
interface Education {
  from: string;
  to: string;
  title: string;
  school: string;
  location: string;
  description: string;
}

interface Career {
  from: string;
  to: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

// Education and Career data
const education: Education[] = [
  {
    from: '09/2024',
    to: '08/2027',
    title: 'Student',
    school: 'Carl-Severing-Berufskolleg',
    location: 'Bielefeld, Germany',
    description: 'Pursuing vocational education in software development, focusing on practical skills and theoretical knowledge.',
  },
  {
    from: '09/2015',
    to: '08/2021',
    title: 'Student',
    school: 'Bertolt-Brecht-Gesamtschule',
    location: 'Löhne, Germany',
    description: 'Completed secondary school education with a focus on science and technology subjects.',
  },
  {
    from: '09/2011',
    to: '08/2015',
    title: 'Student',
    school: 'Ev. Grundschule Obernbeck',
    location: 'Löhne, Germany',
    description: 'Completed primary/elementary school education, laying the foundation for further academic pursuits.',
  },
  {
    from: '2008',
    to: '08/2011',
    title: 'Kindergartner',
    school: 'Ev. Kindergarten Die Arche',
    location: 'Löhne, Germany',
    description: 'Attended kindergarten, developing social skills and preparing for formal education.',
  },
];

const career: Career[] = [
  {
    from: '08/2024',
    to: 'Present',
    title: 'Application Developer',
    company: 'Prodress Software GmbH',
    location: 'Bielefeld, Germany',
    description: 'Developing and maintaining software applications, collaborating with cross-functional teams to deliver high-quality products.',
  },
  {
    from: '17/09/2022',
    to: '21/09/2022',
    title: 'Application Developer',
    company: 'Mittwald CM Service',
    location: 'Espelkamp, Germany',
    description: 'Completed an internship, gaining hands-on experience in application development and understanding industry practices.',
  },
  {
    from: '09/2015',
    to: '08/2024',
    title: 'Freelancer',
    company: 'Self-Employed',
    location: 'Remote',
    description: 'Worked on various freelance projects, building websites and more for clients across different industries.',
  },
];

export default function AboutPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} has been copied to clipboard.`, { position: 'bottom-center' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='container max-w-5xl p-4'>
        <motion.div variants={container} initial='hidden' animate='show' className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* About Me */}
          <motion.div variants={item} className='md:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Nikki Sophie Berthold</CardTitle>
                <CardDescription>Developer & Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground whitespace-pre-line'>
                  {`Based in Germany and currently 20 years old, I bring fresh perspectives to my work.

                  I focus on creating accessible, user-friendly solutions that work seamlessly and look great.
                  I'm passionate about building products that make a difference and help people.
                  Working across the stack allows me to turn ideas into reality from start to finish.

                  Always eager to improve, I regularly explore new tools and technologies to keep my skills sharp and up-to-date. 
                  
                  Feel free to explore my work or reach out — I'd love to connect!
                  `}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Brain className='text-primary h-5 w-5' />
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary'>•</span>
                    <span>Focus on user experience</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary'>•</span>
                    <span>Strong problem-solving abilities</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary'>•</span>
                    <span>Commitment to continuous learning</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary'>•</span>
                    <span>Collaborative and supportive</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Socials */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Users className='text-primary h-5 w-5' />
                <CardTitle>Socials</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  <Button asChild variant='outline' size='sm' className='gap-1.5'>
                    <Link href='mailto:contact@niso.moe'>
                      <Mail className='h-4 w-4' />
                      <span>Mail</span>
                    </Link>
                  </Button>

                  <Button variant='outline' size='sm' className='gap-1.5'>
                    <Twitter className='h-4 w-4' />
                    <span>Twitter/X</span>
                  </Button>

                  <Button variant='outline' size='sm' className='gap-1.5'>
                    <Instagram className='h-4 w-4' />
                    <span>Instagram</span>
                  </Button>

                  <Button variant='outline' size='sm' className='gap-1.5'>
                    <Github className='h-4 w-4' />
                    <span>GitHub</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm' className='gap-1.5'>
                        <span>Discord</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => copyToClipboard('303142922780672013', 'User ID')}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy User ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard('cutenikki', 'Username')}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy Username
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open('https://discord.com/users/303142922780672013', '_blank')}>
                        <ExternalLink className='mr-2 h-4 w-4' />
                        Open Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Languages */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Code className='text-primary h-5 w-5' />
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>HTML</Badge>
                  <Badge>CSS</Badge>
                  <Badge>JavaScript</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Java</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Backend */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Database className='text-primary h-5 w-5' />
                <CardTitle>Back-End</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>Node</Badge>
                  <Badge>Bun</Badge>
                  <Badge>NPM</Badge>
                  <Badge>PNPM</Badge>
                  <Badge>Yarn</Badge>
                  <Badge>Express</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Frontend */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Globe className='text-primary h-5 w-5' />
                <CardTitle>Front-End</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>Next</Badge>
                  <Badge>React</Badge>
                  <Badge>React Native</Badge>
                  <Badge>Tailwind</Badge>
                  <Badge>Shadcn/UI</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Databases */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Database className='text-primary h-5 w-5' />
                <CardTitle>Databases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>MongoDB</Badge>
                  <Badge>PostgreSQL</Badge>
                  <Badge>MySQL</Badge>
                  <Badge>SQLite</Badge>
                  <Badge>Redis</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Editors */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Laptop className='text-primary h-5 w-5' />
                <CardTitle>Editors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>VS Code</Badge>
                  <Badge>Eclipse IDE</Badge>
                  <Badge>IntelliJ IDEA</Badge>
                  <Badge>WebStorm</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Other Tools */}
          <motion.div variants={item}>
            <Card className='h-full gap-4'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Wrench className='text-primary h-5 w-5' />
                <CardTitle>Other Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge>Git</Badge>
                  <Badge>ChatGPT</Badge>
                  <Badge>Copilot</Badge>
                  <Badge>Figma</Badge>
                  <Badge>Photoshop</Badge>
                  <Badge>Illustrator</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className='md:col-span-2'></motion.div>

          <motion.div variants={item} className='flex w-full flex-col gap-6 md:col-span-2 md:flex-row'>
            {/* Career */}
            <Card className='h-fit md:w-1/2'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <Briefcase className='text-primary h-5 w-5' />
                <CardTitle>Career</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {career.map((item, index) => (
                    <div key={index} className='border-muted relative border-l pb-6 pl-6 last:pb-0'>
                      <div className='bg-primary absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full'></div>
                      <div className='mb-1 flex flex-col justify-between gap-1 lg:flex-row lg:items-center'>
                        <div className='flex flex-col'>
                          <p className='text-muted-foreground mb-1 text-sm'>{item.title}</p>
                          <h3 className='text-base font-medium'>{item.company}</h3>
                        </div>
                        <div className='text-muted-foreground flex items-center text-sm'>
                          <Calendar className='mr-1 h-3.5 w-3.5' />
                          {item.from} - {item.to}
                        </div>
                      </div>
                      <p className='text-muted-foreground mb-1 text-sm'>{item.location}</p>
                      <p className='text-sm'>{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Education */}
            <Card className='h-fit md:w-1/2'>
              <CardHeader className='flex flex-row items-center gap-2'>
                <GraduationCap className='text-primary h-5 w-5' />
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {education.map((item, index) => (
                    <div key={index} className='border-muted relative w-full border-l pb-6 pl-6 last:pb-0'>
                      <div className='bg-primary absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full'></div>
                      <div className='mb-1 flex flex-col justify-between gap-1 lg:flex-row lg:items-center'>
                        <div className='flex flex-col'>
                          <p className='text-muted-foreground mb-1 text-sm'>{item.title}</p>
                          <h3 className='text-base font-medium'>{item.school}</h3>
                        </div>
                        <div className='text-muted-foreground flex items-center text-sm'>
                          <Calendar className='mr-1 h-3.5 w-3.5' />
                          {item.from} - {item.to}
                        </div>
                      </div>
                      <p className='text-muted-foreground mb-1 text-sm'>{item.location}</p>
                      <p className='text-sm'>{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Badge component for skills, languages, etc.
function Badge({ children }: { children: React.ReactNode }) {
  return <span className='bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'>{children}</span>;
}
