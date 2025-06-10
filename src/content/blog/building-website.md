---
title: "Building this website"
description: "A documentation of the process as well as the articles, tutorials and resources used when building this website"
pubDate: "Jul 08 2022"
categories: ["programming", "astro", "js"]
---

This blog is basically built on top of the default Astro blog template and constructed
in a fairly standard way. This post is documenting all the websites, articles and
resources I used for inspiration and instruction while building it. It is thanks to
these builders that this website exists and was crafted. I am eternally blessed that
these people chose to share their knowledge and resources to the world and I stand on
the shoulders of these giants.

Repository for the website is on [GitHub](https://github.com/aniforprez/website).

All these links do not include all the dependent open source packages installed using
npm and their authors to whom I am forever grateful.

## Inspiration

- Design heavily inspired by [this website by Zak Archer](https://zakarcher.com/)
- General content and design inspiration from [the website of Ariel Salminen](https://arielsalminen.com/)

## Tutorials

- Dark mode code from [this tutorial by Kevin Zuniga Cueller](https://www.kevinzc.com/blog/dark-mode-in-astro/)
- Code for the contact form heavily inspired by [this tutorial by "Web Reaper"](https://cosmicthemes.com/blog/astro-effective-contact-form/)
- Table of contents for the blog posts aided by [this tutorial by Noah Falk](https://noahflk.com/blog/astro-table-of-contents)
- Scroll spy for the table of contents made prettier with help from [this tutorial by Fazza Razaq Amiarso](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25)

## Resources

- Static Site Generation powered by [Astro](https://astro.build/)
- Styling powered by [Tailwind](https://tailwindcss.com/)
  - Also using the [Tailwind Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography) (though the documentation seems outdated for Tailwind 4)
- Tooltips using [TippyJS](https://atomiks.github.io/tippyjs/)
- Icons in general copied from [Remix Icon](https://remixicon.com/)
- Icons for programming technologies sourced from [Devicon](https://devicon.dev/)
- Cursive font for headings is [Victor Mono](https://fonts.google.com/specimen/Victor+Mono)
- General website font is [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## Deployment

The site is deployed to [Netlify](https://www.netlify.com/), connected to my GitHub account so it is deployed fresh on every push on the repository to GitHub.
