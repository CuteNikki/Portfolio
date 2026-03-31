# My Personal Portfolio

A personal portfolio website built with **Next.js 16**, **React 19**, and **TypeScript**. Features a public-facing portfolio with projects, blog posts, and a contact form, as well as a protected admin dashboard for content management.

**Live Site:** [niso.moe](https://niso.moe)

## Features

- **Portfolio & About** — Home page with career, education, skills, and social links
- **Projects** — Showcase of projects with tags, technologies, and links
- **Blog Posts** — Markdown-powered blog with syntax highlighting, GFM support, and nested comments
- **Contact Form** — Email delivery via Resend
- **Admin Dashboard** — Protected area for managing posts, projects, and users (admin-only)
- **Authentication** — Discord OAuth2 login with session management
- **Theming** — Light, dark, system, and Catppuccin themes
- **Bilingual Legal Pages** — Imprint & privacy policy in English and German

## Tech Stack

| Layer      | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React Compiler)                     |
| Language   | TypeScript                                                  |
| Runtime    | Bun                                                         |
| Database   | PostgreSQL via Prisma ORM                                   |
| Styling    | Tailwind CSS 4, shadcn/ui, Radix UI                         |
| Auth       | Discord OAuth2 (custom implementation)                      |
| Email      | Resend + React Email                                        |
| Animations | Framer Motion                                               |
| Markdown   | react-markdown, remark-gfm, rehype-slug, syntax-highlighter |
| Tables     | TanStack Table                                              |
| Forms      | React Hook Form + Zod validation                            |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- PostgreSQL database

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Discord OAuth2
DISCORD_CLIENT_SECRET=
NEXT_PUBLIC_DISCORD_CLIENT_ID=
NEXT_PUBLIC_DISCORD_REDIRECT_URI=

# Resend (Email)
RESEND_API_KEY=
RESEND_EMAIL_FROM=
RESEND_EMAIL_TO=
```

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run prisma:generate

# Run database migrations
bun run prisma:migrate

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

| Script                   | Description                    |
| ------------------------ | ------------------------------ |
| `bun run dev`            | Start development server       |
| `bun run build`          | Generate Prisma client & build |
| `bun run start`          | Start production server        |
| `bun run lint`           | Run ESLint                     |
| `bun run format`         | Format code with Prettier      |
| `bun run prisma:studio`  | Open Prisma Studio             |
| `bun run prisma:migrate` | Run database migrations        |
| `bun run prisma:reset`   | Reset database                 |

## Project Structure

```
src/
├── actions/        # Server actions (mail, posts, projects, users)
├── app/
│   ├── (regular)/  # Public pages (home, posts, projects, contact, legal)
│   ├── api/auth/   # Discord OAuth2 routes
│   └── dashboard/  # Admin dashboard (posts, projects, users)
├── components/     # UI components (shadcn/ui, dashboard, navigation)
├── constants/      # Site metadata, links, personal details
├── hooks/          # Custom React hooks
├── lib/            # Auth, Prisma client, utilities
├── providers/      # Context providers (auth, theme, toast)
└── types/          # TypeScript type definitions
prisma/
├── schema.prisma   # Database schema
└── migrations/     # Migration history
```

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with ❤️ by Nikki
