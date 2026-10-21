# My Personal Portfolio

A personal portfolio website built with **Next.js 16**, **React 19**, and **TypeScript**. Features a public-facing portfolio with projects, blog posts, and a contact form, as well as a protected admin dashboard for content management.

**Live Site:** [niso.moe](https://niso.moe)

## Features

- **Portfolio & About**: Home page with career, education, skills, and social links
- **Projects**: Showcase of projects with tags, technologies, and links
- **Blog Posts**: Markdown-powered blog with syntax highlighting, GFM support, and nested comments
- **Contact Form**: Email delivery via our own mail server (Stalwart at mail.niso.moe)
- **Dashboard**: Protected area where writers and admins manage posts, projects, comments, and pictures, and admins manage users
- **Authentication**: Discord OAuth2 login with session management
- **Theming**: Light, dark, system, and Catppuccin themes
- **Bilingual Legal Pages**: Imprint & privacy policy in English and German

## Tech Stack

| Layer      | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React Compiler)                     |
| Language   | TypeScript                                                  |
| Runtime    | Bun                                                         |
| Database   | PostgreSQL via Prisma ORM                                   |
| Styling    | Tailwind CSS 4, shadcn/ui, Radix UI                         |
| Auth       | Discord OAuth2 (custom implementation)                      |
| Email      | Nodemailer + React Email                                    |
| Animations | Framer Motion                                               |
| Markdown   | react-markdown, remark-gfm, rehype-slug, syntax-highlighter |
| Tables     | TanStack Table                                              |
| Forms      | Server Actions, Zod validation                              |

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

# Email: SMTP_URL logs in to the mail server, e.g. smtps://no-reply%40niso.moe:password@mail.niso.moe
SMTP_URL=
EMAIL_FROM=
EMAIL_TO=

# Pictures: the site's own key on the image server (see Pictures below)
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
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

The build doesn't touch the database. Apply new migrations to the live database with `bunx prisma migrate deploy`, and when a migration removes something, deploy the code that stops using it first.

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

## Pictures

Covers for posts and projects, and the further pictures of a project, are kept on our own [Garage](https://garagehq.deuxfleurs.fr) server and load from `https://images.niso.moe`, in the same bucket as the [plushies site](https://plushies.niso.moe)'s photos. The browser shrinks each picture into a small and a large WebP before it goes (`IMAGE_SIZES` in `src/lib/images.ts`), asks the site for links to upload them to (`requestImageUpload` in `src/actions/upload.ts`) and sends them there itself. The links last 5 minutes, are signed for that file's type and size, and are only handed to writers and admins. The site saves the large copy's address; cards and lists show the small one. Pictures that are replaced, removed or left in an unsaved form are deleted again once the change is saved.

Each picture is a folder `portfolio/<database>/<id>/` with `small.webp` and `large.webp` (`.jpg` from a browser that can't write WebP). `<database>` is named after the database (`uploadFolder` in `src/lib/uploads.ts`), so a local copy of the site never touches the live site's pictures. Garage can't limit a key to part of a bucket, so the site's own checks (`ownImageKey`) are what keep it inside its folder and away from the plushies photos.

To set it up on the server, with `garage` standing for `docker exec image-storage /garage`:

1. Give the site a key of its own and let it use the bucket:
   ```sh
   garage key create portfolio-site      # its Key ID and Secret key are STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY
   garage bucket allow --read --write images.niso.moe --key portfolio-site
   ```
2. Let the site's pages upload: the bucket's CORS rule has to allow `PUT` with a `content-type` header from `https://niso.moe` as well. Setting CORS replaces the whole rule, so keep the plushies origins in it: `https://plushies.niso.moe`, `https://niso.moe` and `http://localhost:3000`.
3. Set `STORAGE_ACCESS_KEY_ID` and `STORAGE_SECRET_ACCESS_KEY` on the host. The Caddy setup that serves `images.niso.moe` is already in place for the plushies site.

The plushies dashboard's storage meter counts the whole bucket, so the portfolio's pictures count towards it too.

For local testing against another S3-compatible server, set `STORAGE_API_URL` (where uploads go, bucket included) and `IMAGE_PUBLIC_URL` (where pictures are read from).

## Project Structure

```
src/
├── actions/        # Server actions (account, mail, posts and comments, projects, uploads, users)
├── app/
│   ├── (regular)/  # Public pages (home, posts, projects, contact, account, legal)
│   ├── api/        # Discord OAuth2 routes, account data export, upload cleanup
│   └── dashboard/  # Dashboard for writers and admins (posts, projects, comments, media, users)
├── assets/         # Fonts for the link preview images
├── components/     # UI components (shadcn/ui, dashboard, navigation)
├── constants/      # Site metadata, links, personal details
├── lib/            # Auth, Prisma client, data loading, Markdown, uploads, utilities
├── providers/      # Context providers (theme, toast)
└── types/          # TypeScript type definitions
prisma/
├── schema.prisma   # Database schema
└── migrations/     # Migration history
```

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with ❤️ by Nikki
