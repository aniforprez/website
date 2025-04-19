---
title: "How I built my website"
description: "How I built this website with Zola, Tailwind and Netlify"

# The date of the post.
# Two formats are allowed: YYYY-MM-DD (2012-10-02) and RFC3339 (2002-10-02T15:00:00Z).
# Do not wrap dates in quotes; the line below only indicates that there is no default date.
date: 2022-10-27

# The last updated date of the post, if different from the date.
# Same format as `date`.
# updated =

# A draft page is only loaded if the `--drafts` flag is passed to `zola build`, `zola serve` or `zola check`.
draft: true

# If set, this slug will be used instead of the filename to make the URL.
# The section path will still be used.
# slug = ""

# The path the content will appear at.
# If set, it cannot be an empty string and will override both `slug` and the filename.
# The sections' path won't be used.
# It should not start with a `/` and the slash will be removed if it does.
# path = ""

# Use aliases if you are moving content but want to redirect previous URLs to the
# current one. This takes an array of paths, not URLs.
aliases: []

# When set to "true", the page will be in the search index. This is only used if
# `build_search_index` is set to "true" in the Zola configuration and the parent section
# hasn't set `in_search_index` to "false" in its front matter.
in_search_index: true

# Template to use to render this page.
# template = "page.html"

# The taxonomies for this page. The keys need to be the same as the taxonomy
# names configured in `config.toml` and the values are an array of String objects. For example,
# tags = ["rust", "web"].
taxonomies:
  tags: ["engineering", "blogging"]

# Your own data.
extra:
---

## Introduction { .group }

I've been trying to write blogs for over a decade at this point. Ever since I was a kid, I've been fascinated with the
idea of writing something. I wrote many a small short story and have fond memories of wrangling the layout of my Microsoft Word documents to submit to my will and I do cringe slightly thinking about them. I've also made numerous
attempts at writing blogs on Wordpress, Blogger, GitHub Pages, Ghost and so on. None of these ever stuck beyond a couple
of "articles" that I'd push out and then completely abandon the whole thing.

So why am I doing this once more? Well, I decided to buy a domain for myself and thought I'd try my hand at picking up a newfangled static site generators to see if I could spin up something that was personal but also
functional. This is a chronicle of my technical journey through building and deploying this site. It may be a bit long
winded since this is mostly a stream of consciousness but it's my blog and dammit I'll do what I want.

I'll start with why I picked [Zola](https://www.getzola.org/) but I'll go into more details on other static site options in
[this section](#blog-hosting-and-development-in-2022).

### Pros for using Zola { .group }

- Zola is ridiculously simple for a SSG (Static Site Generator). The `zola` command provides all of FIVE options and
  developing with it is _very_ fast. Running `zola serve` and editing templates or markdown articles regenerates and
  live reloads the site within 40ms on my machine and gives me instant feedback on my styling and article changes. This
  is supremely helpful and is no surprise since it is written in [Rust](https://www.rust-lang.org/) which is incredibly fast and compiles to assembly.
- Zola uses the [Tera](https://tera.netlify.app/) template engine whose syntax is extremely similar to [Django's](https://docs.djangoproject.com/en/4.1/topics/templates/#the-django-template-language) template syntax. I have been working for years with Django and the template syntax is fairly easy to grok. Tera has a lot of similar [in-built filters](https://tera.netlify.app/docs/#built-ins) which is quite helpful.
- Zola is incredibly flexible. Zola has no opinions on how you should organise your posts or templates and lets you define your pages as you need. A ton of aspects are customizable like which template to render for which section or post and so on.

### Cons of using Zola { .group }

Zola isn't without its drawbacks. Some of them are:

- While Zola is unopinionated and fairly customizable, there are still times where I hit roadblocks in terms of what I could do. For eg. I have no way of customizing how my markdown is rendered into HTML without manually adding tags to my markdown. This means I cannot add attributes to the tags that are rendered which would have been very helpful if I wanted to use [native lazy loading for images](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading).
- The documentation is fairly difficult to navigate and some the sections could be reorganised better to represent a journey through building your own site.

Since you're here assuming I'm using Zola, let's get it started.

## Getting started { .group }

### Installation and dependency management { .group }

First thing you do is simply [install Zola](https://www.getzola.org/documentation/getting-started/installation/). Follow the installation instructions for your platform. I use a Macbook so I used `brew` to install it with `brew install zola`. Following this, I ran the command to initialize my website repository with `zola init website`. I did not want SASS compilation since I would be using Tailwind which does its own processing with PostCSS and wanted syntax highlighting and search indexing.

```bash
zola init website

Welcome to Zola!
Please answer a few questions to get started quickly.
Any choices made can be changed by modifying the `config.toml` file later.
> What is the URL of your site? (https://example.com): https://aniforprez.dev
> Do you want to enable Sass compilation? [Y/n]: n
> Do you want to enable syntax highlighting? [y/N]: y
> Do you want to build a search index of the content? [y/N]: y
```

We'll discuss what search indexing does later. Syntax highlighting is self-explanatory in that it configures Zola to enable syntax highlighting in code blocks in numerous pre-configured languages.

Go into the directory with `cd website` or whatever you decided to call your blog directory. Let's also use Git to version control our website so run `git init` to initialise your git repository. Make sure to keep committing and uploading your changes to a git hosting service like [GitHub](https://github.com) to not lose your work!

Since we're planning to use Tailwind, let's use NPM to manage that. If you don't have NPM, you can get it by [installing NodeJS](https://nodejs.org/en/download/). Once you have npm available, run `npm init` in the directory created by Zola and it should create a `package.json` for you. Your directory should look something like this:

```bash
tree

.
├── config.toml
├── content
├── package.json
├── static
├── templates
└── themes

4 directories, 4 files
```

### Init project and serving for dev { .group }

To install Tailwind to style the website, run `npm i -D tailwindcss` to install Tailwind and run `npx tailwindcss init` to create the Tailwind configuration files. This should create a `tailwind.config.js` file in your directory.

These will look a little something like this:

```js
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Tailwind operates by generating a CSS file on the fly by reading all the files in your directory, compiling a list of all the Tailwind CSS classes you use and dumping it into a CSS file. To do this, it needs a list of all the documents where it can potentially find CSS classes. For our purposes, we will configure it to watch all the markdown and HTML files in the content and template directories like so:

```js,hl_lines=6-8
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./content/**/*.html",
    "./templates/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

You can use the `theme` setting to add your own fonts and styles to change how Tailwind generates its classes. I used it to customize the fonts used on this site. [Here's my Tailwind config file for reference](https://github.com/aniforprez/website/blob/master/tailwind.config.js).

We'll add the [tailwind typography plugin](https://tailwindcss.com/docs/typography-plugin) to set sensible defaults for the style of our rendered markdown. This will save the headache of styling individual headers, lists, text and so on. Very cool! Install it with `npm install -D @tailwindcss/typography` and configure your `tailwind.config.js` to use the plugin:

```js,hl_lines=13
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./content/**/*.md",
    "./content/**/*.html",
    "./templates/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
```

To get the ball rolling, we'll also need to create a CSS file that Tailwind will use to compile the stylesheet so we'll create a file at `static/css/tailwind.css`.

```css
/* static/css/tailwind.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Finally, we will want Tailwind to continually watch all our files for changes and compile a CSS file that we can use in our templates. We'll write a short script in the `package.json` file that'll do this for us so let's add them.

```json
{
  ...

  "scripts": {
    "dev": "NODE_ENV=development npx tailwindcss -i ./static/css/tailwind.css -o ./static/css/main.css --watch",
    "build": "NODE_ENV=production npx tailwindcss -i ./static/css/tailwind.css -o ./static/css/main.css --minify"
  },

  ...
}
```

What these commands do is look for Tailwind classes in all the files we specified and generates a CSS file at `static/css/main.css` which only contains the classes you're using. This makes sure you're not using a massive CSS file that contains every class that Tailwind offers which would be massive. The `--watch` command option will run the tool continuously which is useful for development and the `--minify` option compresses the CSS and dumps it which works very well for when we deploy the website later.

We are storing the CSS file in `static/css` directory because Zola will simply copy every file in the static directory into a `public` directory and this lets us very easily serve these files from there.

### Options { .group }

Let's go into some of the useful options that Zola gives us. Zola very helpfully creates a `config.toml` file which contains a bunch of the options to customize your site. I'm not going into every option since the file contains descriptions for every option and you can find more documentation on the [Zola website](https://www.getzola.org/documentation/getting-started/configuration/). Some of the options that were useful to me and that I want to bring up right now are:

```toml
# This setting generates an RSS feed for your website
generate_feed = true

[markdown]
# Whether to do syntax highlighting
# Theme can be customised by setting the `highlight_theme` variable to a theme supported by Zola
highlight_code = true

# The theme to use for code highlighting.
# Change this to the theme of your choice. I love dracula
# The list of themes are available here:
#   https://www.getzola.org/documentation/getting-started/configuration/#syntax-highlighting
highlight_theme = "dracula"
```

## Templates { .group }

### Dark mode { .group }

### Index page { .group }

### About Page { .group }

### Blog Page { .group }

### Page page lol { .group }

### Anchor layout and problems { .group }

### Taxonomy { .group }

## Deploying { .group }

### Available options { .group }

### Netlify { .group }

- Github integration
- Configuration
- Headers for caching

## Miscellaneous { .group }

### Meta tags { .group }

### Lighthouse scores { .group }

## What's next? { .group }

- Maintain blog
- Write about random things
- Overstuffed sense of self

### Blog hosting and development in 2022 { .group }

I suppose the first question someone would ask me (including myself) is why even go through the trouble of doing this
myself. There has never been a dearth of options to build your own site. Numerous CMSs, SSGs and frameworks exist for
every permutation of peoples' needs and you would have the time of your life evaluating them all. Well, as a software
engineer with a fair few years under his belt, I felt that I really wanted to make this site personal and have it as
personal as I wanted. As it stands, none of this site is built with a pre-built theme. I have personally styled this
site to my liking except the actual markdown render but we'll get to that. This level of personalization pleases me and
I gather a small bit of joy looking at it.

[Ghost](https://ghost.org/) is an extremely extensive CMS/Blogging platform that has an absurd amount of features and
themes. It has support for various ways to monetize your content, a really good content editor, an extensive set of
[themes](https://ghost.org/themes/) and excellent [developer documentation](https://ghost.org/docs/) to even host your
own Ghost instance so you don't have to use their own paid hosting service... and this is mostly why I avoided using it.
This is just way too much going on and makes it feel very impersonal and pre-built. I want to make it clear, it doesn't
really have to be this way and you can build your own themes but I just couldn't reconcile using something this heavily
built already. It felt like using a tank to dig a hole for your plants.

- Hugo
- Next
- Jekyll
