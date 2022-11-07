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

## Introduction

### Blog and hosting in 2022

Options:

* Ghost
* Hugo
* Next
* Jekyll

### Why I picked Zola

* Simple
* Templating language I recognise
* Wanted flexibility
* Extremely fast

### Cons of using Zola

* No simple search features out of the box
* Very low customization
  * Can't change image tags to be lazy loaded using load=lazy
  * Anchor tag customization was a pain
* Scattered and unclear documentation

## Getting started

### Installation and dependency management

### Init project and serving for dev

### Options

## Templates and styling

### Tailwind setup

### Dark mode

### Index page

### About Page

### Blog Page

### Page page lol

### Anchor layout and problems

### Taxonomy

### Search

## Deploying

### Available options

### Netlify

* Github integration
* Configuration
* Headers for caching

## Miscellaneous

### Meta tags

### Lighthouse scores

## What's next?

* Maintain blog
* Write about random things
* Overstuffed sense of self
