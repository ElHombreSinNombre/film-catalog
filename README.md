# Film Catalog

**Film Catalog** is a full-stack project designed to explore and master the core features of **Astro**.

## Technologies

- **[Astro](https://astro.build/)**
- **[Tailwind](https://tailwindcss.com/)**
- **[Supabase](https://supabase.com/)**

## How to deploy

Execute this [SQL](src\supabase\supabase.sql) in **Supabase**.

Rename `.example.env` files to `.env` to configure Supabase and The Movie Database (TMDB) credentials.

Finally execute these commands in your terminal.

```bash
npm install
npm run dev
```

> [!NOTE]
> Sometimes The Movie Database (TMDB) experiences issues, so the project uses mock data as a fallback.
