'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

import { Brain, Briefcase, Calendar, Copy, ExternalLink, GraduationCap, Users } from 'lucide-react';

import { aboutMe, career, categories, education, skills, socials } from '@/constants/about';

import { ShootingStars } from '@/components/theme/shooting-stars';
import { StarsBackground } from '@/components/theme/stars-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
      <ShootingStars />
      <StarsBackground />
      <div className='container max-w-5xl p-4'>
        <motion.div variants={container} initial='hidden' animate='show' className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* About Me */}
          <motion.div variants={item} className='md:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>{aboutMe.name}</CardTitle>
                <CardDescription>{aboutMe.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-line'>{aboutMe.description}</p>
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
                  {skills.map((skill, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <span className='text-primary'>•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
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
                  {socials.map((social, index) => (
                    <Button key={index} asChild variant='outline' size='sm' className='gap-1.5'>
                      <Link href={social.href} target='_blank' rel='noopener noreferrer'>
                        {social.icon}
                        <span>{social.name}</span>
                      </Link>
                    </Button>
                  ))}

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

          {/* Languages, back-end, front-end, editors, other tools */}
          {categories.map((category, index) => (
            <motion.div key={index} variants={item}>
              <Card className='h-full gap-4'>
                <CardHeader className='flex flex-row items-center gap-2'>
                  {category.icon}
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {category.items.map((item, index) => (
                      <Badge variant='secondary' key={index}>
                        {item.icon} {item.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Career and Education */}
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
