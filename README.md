# My Website ([aniforprez.dev]())

This website was developed with [Astro](https://astro.build). The project uses `pnpm`.

## 🚀 Project Structure

Inside of the project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Components can be saved to `src/components/`.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory and images meant to be processed (optimised, compressed etc) can be placed in the `src/images` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Building resume file

Remove the leading `_` character in front of the `_resume-dev.astro` file inside the `src/pages` directory and load the page at the `/resume-dev` path on the dev site. The site should load basic unstyled data from `src/content/resume.json`. The PDF file can be obtained by using the browser's "print" function which should apply the print styles configured. Once done, add the "_" back to not expose the file on the production website. Place the resume PDF file in the `public` directory as `resume.pdf`.
