# My Personal Portfolio

A personal portfolio website built with **Next.js 16**, **React 19**, and **TypeScript**. Features a public-facing portfolio with projects, blog posts, and a contact form, as well as a protected admin dashboard for content management.

**Live Site:** [niso.moe](https://niso.moe)

## Features

- **Portfolio & About**: Home page with career, education, skills, and social links
- **Projects**: Showcase of projects with tags, technologies, and links
- **Blog Posts**: Markdown-powered blog with syntax highlighting, GFM support, and nested comments
- **Contact Form**: Email delivery through any SMTP server (we run our own, Stalwart)
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

# Email: SMTP_URL logs in to the mail server, e.g. smtps://no-reply%40example.com:password@mail.example.com
SMTP_URL=
EMAIL_FROM=
EMAIL_TO=

# Pictures: the site's own key on the image server (see Pictures below)
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
```

### Installation

```bash
# Install dependencies (this also generates the Prisma client)
bun install

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`.

The build reads the published posts and projects to prerender them, but never changes the database. New migrations are applied by the Docker image's `migrate` stage, which runs before the site starts (or by hand with `bun run db:deploy`). When a migration removes something, deploy the code that stops using it first.

### Available Scripts

| Script                 | Description                                |
| ---------------------- | ------------------------------------------ |
| `bun run dev`          | Start development server                   |
| `bun run build`        | Build for production                       |
| `bun run start`        | Start production server                    |
| `bun run typecheck`    | Check types                                |
| `bun run lint`         | Run ESLint                                 |
| `bun run format`       | Format code with Prettier                  |
| `bun run format:check` | Check formatting                           |
| `bun run db:migrate`   | Create and apply migrations in development |
| `bun run db:deploy`    | Apply migrations to the database           |
| `bun run db:studio`    | Open Prisma Studio                         |
| `bun run db:reset`     | Reset database                             |

## Pictures

Covers for posts and projects, and the further pictures of a project, are kept on our own [Garage](https://garagehq.deuxfleurs.fr) server, in a bucket of the site's own, `portfolio`, and load from `IMAGE_PUBLIC_URL` + `/portfolio/`. The browser shrinks each picture into four WebP copies before it goes, 400, 640, 960 and 2000 pixels on the longest side (`IMAGE_SIZES` in `src/lib/images.ts`), asks the site for links to upload them to (`requestImageUpload` in `src/actions/upload.ts`) and sends them there itself, through Garage's S3 API at `STORAGE_ENDPOINT`. The links last 5 minutes, are signed for that file's type and size, and are only handed to writers and admins. The site saves the large copy's address; pages list all four in `srcset`, so each screen loads the closest one. Pictures that are replaced, removed or left in an unsaved form are deleted again once the change is saved.

Each picture is a folder `portfolio/<database>/<id>/` with `thumb.webp`, `phone.webp`, `small.webp` and `large.webp` (`.jpg` from a browser that can't write WebP). `<database>` is named after the database's address (`uploadFolder` in `src/lib/uploads.ts`), so a local copy of the site never touches the live site's pictures. The address changes when the database moves or is reached another way, say through an SSH tunnel, so then set `STORAGE_FOLDER` to the folder the pictures are already in (`portfolio/<database>`). The `portfolio/` part is from when every site shared one bucket: addresses still start with it, and `src/lib/storage.ts` leaves it off inside the bucket, which the image server serves under `/portfolio/`.

To set it up on the server, with `garage` standing for `docker exec garage /garage`:

1. Give the site a key of its own and let it use its bucket, and only that:
   ```sh
   garage key create portfolio-site      # its Key ID and Secret key are STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY
   garage bucket allow --read --write portfolio --key portfolio-site
   ```
2. Let the site's pages upload: the bucket's CORS rule allows `PUT` with a `content-type` header from the site's own address and `http://localhost:3000`.
3. Set `STORAGE_ACCESS_KEY_ID` and `STORAGE_SECRET_ACCESS_KEY` on the host, and `STORAGE_ENDPOINT` and `IMAGE_PUBLIC_URL` if they differ from the defaults in `src/lib/storage.ts`. The reverse proxy in front has to serve the bucket's public reads and the S3 API.

For local testing against another S3-compatible server, set `STORAGE_ENDPOINT` (its S3 API), `STORAGE_BUCKET` and `IMAGE_PUBLIC_URL` (where pictures are read from).

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
