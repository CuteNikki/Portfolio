'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { /*Github, Globe, */Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

// Project interface
interface Project {
  id: number;
  name: string;
  shortDescription: string;
  technologies: string[];
  tags: string[];
  links: {
    type: string;
    url: string;
    icon: React.ReactNode;
  }[];
  imageSrc: string;
}

// Sample project data
const projectsData: Project[] = [
  // {
  //   id: 1,
  //   name: 'Portfolio Website',
  //   shortDescription: 'Personal showcase',
  //   technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn/UI'],
  //   tags: ['Front-End', 'Website', 'Personal'],
  //   links: [
  //     { type: 'Website', url: '#', icon: <Globe className='h-4 w-4' /> },
  //     { type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> },
  //   ],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
  // {
  //   id: 2,
  //   name: 'E-commerce Platform',
  //   shortDescription: 'Online shopping experience',
  //   technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
  //   tags: ['Full-Stack', 'Website', 'E-commerce'],
  //   links: [
  //     { type: 'Website', url: '#', icon: <Globe className='h-4 w-4' /> },
  //     { type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> },
  //   ],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
  // {
  //   id: 3,
  //   name: 'Task Manager',
  //   shortDescription: 'Productivity tool',
  //   technologies: ['React Native', 'Firebase', 'Redux'],
  //   tags: ['Mobile', 'App', 'Productivity'],
  //   links: [
  //     { type: 'Website', url: '#', icon: <Globe className='h-4 w-4' /> },
  //     { type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> },
  //   ],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
  // {
  //   id: 4,
  //   name: 'Weather App',
  //   shortDescription: 'Real-time forecasts',
  //   technologies: ['JavaScript', 'HTML', 'CSS', 'Weather API'],
  //   tags: ['Front-End', 'API', 'Weather'],
  //   links: [
  //     { type: 'Website', url: '#', icon: <Globe className='h-4 w-4' /> },
  //     { type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> },
  //   ],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
  // {
  //   id: 5,
  //   name: 'Discord Bot',
  //   shortDescription: 'Server management',
  //   technologies: ['Node.js', 'Discord.js', 'MongoDB'],
  //   tags: ['Back-End', 'Discord Bot', 'Automation'],
  //   links: [{ type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> }],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
  // {
  //   id: 6,
  //   name: 'VS Code Extension',
  //   shortDescription: 'Developer productivity',
  //   technologies: ['TypeScript', 'VS Code API'],
  //   tags: ['Plugin', 'Developer Tool', 'Productivity'],
  //   links: [
  //     { type: 'Website', url: '#', icon: <Globe className='h-4 w-4' /> },
  //     { type: 'Source', url: '#', icon: <Github className='h-4 w-4' /> },
  //   ],
  //   imageSrc: 'https://v0.dev/placeholder.svg?height=800&width=1200',
  // },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  // Extract all unique tags and technologies
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projectsData.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projectsData.forEach((project) => {
      project.technologies.forEach((tech) => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, []);

  // Filter projects based on search query and selected filters
  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesDescription = project.shortDescription.toLowerCase().includes(query);
        const matchesTags = project.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesTechnologies = project.technologies.some((tech) => tech.toLowerCase().includes(query));

        if (!(matchesName || matchesDescription || matchesTags || matchesTechnologies)) {
          return false;
        }
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        if (!project.tags.some((tag) => selectedTags.includes(tag))) {
          return false;
        }
      }

      // Filter by selected technologies
      if (selectedTechnologies.length > 0) {
        if (!project.technologies.some((tech) => selectedTechnologies.includes(tech))) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedTags, selectedTechnologies]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        <motion.h1
          className='mb-8 text-center text-3xl font-bold'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h1>

        {/* Search and Filter Controls */}
        <motion.div className='mb-8 space-y-4' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className='flex flex-col justify-center items-center gap-2 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input placeholder='Search projects...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-fit pl-9' />
              {searchQuery && (
                <Button
                  variant='secondary'
                  size='icon'
                  className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 transform'
                  onClick={() => setSearchQuery('')}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div className='flex gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  {allTags.map((tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTags([...selectedTags, tag]);
                        } else {
                          setSelectedTags(selectedTags.filter((t) => t !== tag));
                        }
                      }}
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    Tech {selectedTechnologies.length > 0 && `(${selectedTechnologies.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  {allTechnologies.map((tech) => (
                    <DropdownMenuCheckboxItem
                      key={tech}
                      checked={selectedTechnologies.includes(tech)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTechnologies([...selectedTechnologies, tech]);
                        } else {
                          setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech));
                        }
                      }}
                    >
                      {tech}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(selectedTags.length > 0 || selectedTechnologies.length > 0) && (
                <Button
                  variant='secondary'
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedTechnologies([]);
                  }}
                  className='bg-muted'
                >
                  <X className='h-4 w-4' />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <motion.div className='py-12 text-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className='text-muted-foreground text-lg'>No projects found matching your criteria.</p>
            <Button
              variant='link'
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setSelectedTechnologies([]);
              }}
              className='mt-2'
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <motion.div variants={container} initial='hidden' animate='show' className='flex flex-wrap justify-center gap-6'>
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className='flex h-full w-72 flex-col gap-2 overflow-hidden pt-0'>
      {/* Image */}
      <div className='relative h-48 overflow-hidden'>
        <Image src={project.imageSrc || 'https://v0.dev/placeholder.svg'} alt={project.name} fill className='object-cover' />
      </div>

      {/* Name and description */}
      <CardHeader className='pt-4 pb-2'>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.shortDescription}</CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className='flex-grow pb-2'>
        <div className='mb-3 flex flex-wrap gap-1.5'>
          {project.tags.map((tag, index) => (
            <span key={index} className='bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'>
              {tag}
            </span>
          ))}
        </div>

        {/* Technologies */}
        <div className='flex flex-wrap gap-1.5'>
          {project.technologies.map((tech, index) => (
            <span key={index} className='bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'>
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Footer with links */}
      <CardFooter className='mt-auto flex gap-2'>
        {project.links.map((link, index) => (
          <Button key={index} variant={index === 0 ? 'default' : 'secondary'} size='sm' className='gap-1.5' asChild>
            <a href={link.url} target='_blank' rel='noopener noreferrer'>
              {link.icon}
              <span>{link.type}</span>
            </a>
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
