---
title: "Building my website"
description: "A documentation of my thought process, as well as the articles, tutorials and resources used, when building this website"
pubDate: "2025-06-11"
heroImage: "../images/building-my-website.jpg"
categories: ["programming", "astro", "js"]
---
_Repository for the website is on [GitHub](https://github.com/aniforprez/website)._

Recently, I've had the time to think a lot, read a lot, and watch and play a lot. I've wanted a solid place to log my thoughts instead of leaving it at the whims of sites like [Trakt](https://trakt.tv/) and [Backloggd](https://backloggd.com/). Moreover, Trakt enforced a [paltry limit of 100 items on watchlists](https://forums.trakt.tv/t/freemium-experience-more-features-for-all-with-usage-limits/41641) which is encouraging me to never use the site which already had a very poor review mechanism where you'd leave a "comment" on things you'd watched. I had far more structured thoughts on movies and shows I'd watched and this motivated me to have a closer look at my website so I could post longer form thoughts there. I have also constantly experimented with new languages and would like to post some tutorials and thoughts somewhere.

I'd built the previous version of this website with [Zola](https://www.getzola.org/) which is a fine static site generator built on Rust. The problem was that Zola was a fairly limited and cumbersome place to develop a website. I use [Tailwind](https://tailwindcss.com/) a lot and using Tailwind meant that I had to keep a constantly running process that would parse all my templates and generate the required CSS into a file that I would have to reference in my templates. It also meant that because Zola uses [Tera](https://keats.github.io/tera/), a templating language based on the [Jinja templating language](https://jinja.palletsprojects.com/en/stable/), I would be editing templates a lot. I HATE editing templates because templates are usually not type safe because there's nothing that really says what data is going to be fed into the template. This means groping in the dark and figuring out something doesn't work by running into errors and this makes me feel gross.

I've been lately getting very much into Typescript and Astro is one of the more popular and relatively simple SSG frameworks out there, offering flexibility in terms of how you write components, be they [React, Vue, Svelte etc](https://docs.astro.build/en/guides/integrations-guide/), and offering type safety in terms of defining [type safe collections](https://docs.astro.build/en/guides/content-collections/) validated by Zod which lets me have Intellisense when developing templates.

This is not going to be a tutorial as much as it is a simple documentation of my thoughts and desires as I made this blog. I had ideas for how I could make my site look fairly swanky and polished and decided to make it happen.

## Inspiration

I'd recently visited the website of [author Zak Archer](https://zakarcher.com/) (aka [Artem Zakharchenko](https://bsky.app/profile/kettanaito.com)) and was deeply inspired by the simplicity and elegance of the design. I was also captivated by the cleanliness of the [voidzero](https://voidzero.dev/) website as well as the patterns on the Tailwind website so decided to make an amalgamation of the concept where it would look like almost like a wireframe with clean thin lines everywhere.

In terms of content and text, I wasn't sure of what I wanted before I spent a significant amount of time but looking around for developer profiles, I found [the website of Ariel Salminen](https://arielsalminen.com/) which is an extremely well rounded portfolio with a lot of sincere and clear writing.

With a fairly solid image of what I wanted in mind, I began the process of actually making it real.

## Construction

As I'd mentioned before, I'd developed a liking for Astro and decided to move ahead with using it to build out the website. The setup process for Astro is extremely straightforward and [well documented](https://docs.astro.build/en/install-and-setup/). Astro set up a basic scaffold for a blog at my instruction that included processing for MDX files and niceties such as a customisable RSS feed, syntax highlighting with Shiki, a sitemap, default OpenGraph headers and a lot of defaults such as an ESLint, Prettier and TSLint config that would make the development process were pleasant. With this done, I proceeded to make my own changes to the templates. Adding Tailwind, to start, was as easy as [running a command](https://docs.astro.build/en/guides/styling/#add-tailwind-4) and linking to a CSS file that would import Tailwind.

### Home Page

Building the index page of the website was fairly straightforward. Since it's just a simple HTML template styled with Tailwind, I moved fairly fast, using [Devicon](https://devicon.dev/) as a source for the icons of all the technologies I have experience with. I picked the font [JetBrains Mono](https://www.jetbrains.com/lp/mono/) as the default font since it's a really pretty monospaced font that I use for personal coding too and decided to use [Victor Mono](https://fonts.google.com/specimen/Victor+Mono) for headings since it's go a fairly pleasing cursive variant.

### About Me

This took some time to come together, mostly due to inertia and some level of anxiety when working on it, but ultimately I settled on having a good amount of text describing myself, a nice photo, some links, and my technial work history. The first three were the same as anything else meanwhile for the work history I decided to use [JSON Resume](https://jsonresume.org/) which is a spec that provides a schema in which to detail out your technical experience which can also be used to generate PDFs. All I had to do was import the `resume.json` file and iterate through it in the template to generate the HTML.

`/src/pages/about.astro`
```astro
---
import resume from "../content/resume.json";
---

{
  resume["work"].map((work) => (
    <div>
      <h3 class="text-xl">{work.name}</h3>
      <p class="text-sm">{work.position}</p>
    </div>
  ))
}
```

Astro is flexible and powerful enough that you can basically import any file that can be read by Javascript and it will let you use it in your template. This is the kind of shenanigans you miss with something like Zola. Very nice!

### Blog

This would obviously be the most technically challenging part of the blog purely in terms of figuring out how the routing for Astro would work to support pagination, adding tags, and other things you'd expect out of a blog. A list of blog posts was fairly easy to implement by importing the collection of blog posts that was already provided through the default Astro blog template. This would fetch all the MDX files inside the `src/content/blog/` directly and pass the content through an RSS schema which would ensure the content would have the required RSS feed fields. I extended the schema with a couple of custom fields I wanted to use to add some spice like an date when the post would be updated and a hero image that would be used for OpenGraph tags for better embedding on social media websites.

`/src/content.config.ts `
```js
// Blog pages
const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: rssSchema
    .extend({
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
    }),
});
```

Now to display all the blog posts, all I'd have to do was fetch all the entries in the collection and list them out.

`/src/pages/blog/index.astro`
```astro
---
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
  // This sorts posts by reverse publishing date so new articles are first
  (a, b) => (b.data.pubDate?.valueOf() || 0) - (a.data.pubDate?.valueOf() || 0),
);
---

<ul>
  {
    posts.map((post) => (
      <li>
        <a href={`/blog/${post.id}/`}>
          <div>
            <img width={800} height={400} src={post.data.heroImage} />
          </div>
          <div>
            <p>{ post.data.pubDate }</p>
            <h4>{post.data.title}</h4>
          </div>
        </a>
      </li>
    ))
  }
</ul>
```

For the individual blog posts themselves, I'd simply render the MDX out with Astro's renderer and use Tailwind's [typography plugin](https://github.com/tailwindlabs/tailwindcss-typography) to style the rendered text. The plugin styles almost all markdown tags, giving you nice headers, images, lists and so on.

` /src/pages/blog/post/[slug].astro `
```astro
---
import { render } from "astro:content";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return posts.map((post, index) => ({params: { slug: post.id },}));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article class="prose prose-stone">
  <Content />
</article>
```

The reason you need to get all the posts in a collection and return a map of all of them along with their slugs is because Astro, as a static site generator, wants advanced knowledge of all the possible routes when rendering the build of the full website and thus we need to fetch all the MDX files and return the slugs for all of them. The contents of each post will then be rendered into the `Content` HTML tag to build each page and the compiled HTML, CSS and JS will be served to visitors.

I decided to add tags to the the blog with links to the tags in each post with a tag page listing all the posts marked with that tag. This would require another page to be created for tags and, as before, Astro requires advance knowledge of all the tags to render out all the tag pages. I didn't want to hardcode tags so I'd have to fetch all the posts and merge all the tags in all the posts together. RSS uses the `category` field to store a list of categories for each post and since this is already available in the RSS schema, we can fetch the lists and merge them and return a list of all the tags on the blog.

`/src/pages/blog/tags/[tag].astro`
```astro
---
import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

export const getStaticPaths = (async ({ paginate }) => {
  const blog_posts = (await getCollection("blog")).sort(
    (a, b) =>
      (b.data.pubDate?.valueOf() || 0) - (a.data.pubDate?.valueOf() || 0),
  );

  const uniqueTags = [
    ...new Set(blog_posts.map((post) => post.data.categories).flat()),
  ].filter((tag) => tag !== undefined);

  return uniqueTags.flatMap((tag) => {
    const filteredPosts = [
      ...blog_posts.filter((post) => post.data.categories?.includes(tag)),
    ];
    return { params: { tag }, props: { posts: filteredPosts } };
  });
}) satisfies GetStaticPaths;

const { tag } = Astro.params;
const { posts } = Astro.props;
---
```

The rest of the page would simply be the same as the list of posts from the index of the blog page.

With this, you get a fully functional blog page but I wanted a few more things to make it really fancy and polished.

* [Dark mode](#dark-mode)
* [A personal list of recommended articles from around the internet](#recommended-articles-list)
* [Pagination for blog posts and tags pages](#pagination)
* [Table of contents for each post](#pagination)
* [View transitions](#view-transitions)
<!-- * Generate OpenGraph images for reviews dynamically
* Search page -->

This would end up being what I'd spend the most time on with good reason. 90% of what I wanted was done. A simple index page, about page, a list of blog posts fetched from Markdown files, pages for the blog posts, and tag pages. The last 10% would be what would take me the rest of the way there and it would take the longest time which is what I expected. So I strapped in.

## Beautification

### Dark Mode

Dark mode was fairly easy to add. Tailwind comes with [dark mode selectors](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) and I could use some simple JS to create a button that would switch the class on the HTML tag to switch modes. I used [this tutorial by Kevin Zuniga Cueller](https://www.kevinzc.com/blog/dark-mode-in-astro/) for the button and some light styling to add an icon that would switch between a sun and moon when appropriate.

### Recommended articles list

I'd decided early on that I also wanted a sort of bookmarks list to spread the word on articles that I'd read and really liked and I decided to hook into Astro's built-in collections feature to make this happen. I decided to store the collection of articles in a JSON file for now that I could edit, commit, and push to the repo to update and add to the list. This also opens me up to the option of later fetching from a simpler place like a CMS or an excel sheet or a Notion document at build time where I could add the link and some fields in a table and it would rebuild when we send a webhook to the hosting service.

I'd store a JSON in `src/content/articles.json` in the following format

```json
{
  "$schema": "./articles.schema.json",
  "articles": [
    {
      "id": "1",
      "title": "Deus Ex: Human Revolution - Graphics Study",
      "author": "Adrian Courrèges",
      "categories": ["graphics", "technical", "gaming"],
      "description": "A great breakdown of how a single frame is rendered in Deus Ex: Human Revolution",
      "link": "https://www.adriancourreges.com/blog/2015/03/10/deus-ex-human-revolution-graphics-study/",
      "pubDate": "2025-05-31"
    },
    //...
  ]
}
```

Now we set up an Astro collection to fetch the list of articles and render it in the blog list page.

` src/content.config.js`
```js

const articles = defineCollection({
  loader: file("./src/content/articles.json", {
    // This fetches the field "articles" in the JSON file
    parser: (text) => JSON.parse(text)["articles"],
  }),

  schema: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    link: z.string().url(),
    categories: z.array(z.string()),
    type: z.enum(["article", "video"]).default("article"),
  }),
});
```

This kind of stuff is really why I like Astro so much. With this simple change we get validation of the content and if I make any error in the JSON it's going to shut the whole build down with an error. And this also gives type safety in the markdown itself because we can simply fetch this collection and iterate on it to display them.

` /src/pages/blog/index`
```astro

---

//...
const recommends = (await getCollection("articles")).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
//...

---
<ul>
{
  recommends.slice(0, 10).map((rec) => (
    <li>{rec}</li>
  ));
}
</ul>
```

It's really that simple.

### Pagination

For pagination, Astro provides a [built-in system](https://docs.astro.build/en/guides/routing/#pagination) that very easily integrates with the existing `getStaticPaths` method. Pagination also requires that Astro be informed beforehand of all the possible pages you can have for a route so you need to fetch all the possible content and paginate it with a default page size.

To indicate that the blog page can accept a page path parameter, we need to change the filename of the blog index page to `[page].astro`.

`/src/pages/blog/index.md -> /src/pages/blog/[page].astro`
```astro
---
export const getStaticPaths = (async ({ paginate }) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) =>
      (b.data.pubDate?.valueOf() || 0) - (a.data.pubDate?.valueOf() || 0),
  );

  return paginate(posts, { pageSize: 10 });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
---

<ul>
  {
    posts.data.map((post) => (
      <li>
        <a href={`/blog/${post.id}/`}>
          <div>
            <img width={800} height={400} src={post.data.heroImage} />
          </div>
          <div>
            <p>{ post.data.pubDate }</p>
            <h4>{post.data.title}</h4>
          </div>
        </a>
      </li>
    ))
  }
</ul>
<nav>
  <a href={page.url.first}>First</a>
  <a href={page.url.prev}>Previous</a>
  <span>Current URL</span>
  <a href={page.url.next}>Next</a>
  <a href={page.url.last}>Last</a>
</nav>
```

As you can see, instead of simply passing on all the posts from the collection, we use the `paginate` parameter given to the function you pass to `getStaticPaths` and then pass the list of posts that we fetched to the pagination function with some options. This gives us a page object that contains the page of posts in `page.data` and all the URLs for the other pages in `page.url`. All the props are described [here](https://docs.astro.build/en/guides/routing/#the-page-prop). We can do this same thing with the recommendations list page.

If I want to paginate tags, then it's a little complex because we want to accept both the tag and the page as a parameter in the URL. Actually, it would be complex if we didn't simply have to send the tag parameter to the pagination function and move the `[tag].astro` page to `[tag]/[page].astro`.

`/src/pages/tags/[tag].astro -> /src/pages/tags/[tag]/[page].astro`
```astro
---
//...
export const getStaticPaths = (async ({ paginate }) => {
  const blog_posts = (await getCollection("blog")).sort(
    (a, b) =>
      (b.data.pubDate?.valueOf() || 0) - (a.data.pubDate?.valueOf() || 0),
  );
  const uniqueTags = [
    ...new Set(blog_posts.map((post) => post.data.categories).flat()),
  ].filter((tag) => tag !== undefined);
  return uniqueTags.flatMap((tag) => {
    const filteredPosts = [
      ...blog_posts.filter((post) => post.data.categories?.includes(tag)),
    ];
    return paginate(filteredPosts, { params: { tag }, pageSize: 10 });
  });
})

const { tag } = Astro.params;
const { page } = Astro.props;
---
```

### Table of contents

Once again, Astro is the MVP here. Astro's content renderer for each post can [return all the headings in the page](https://docs.astro.build/en/guides/markdown-content/#importing-markdown). In the slug page, we can pass the headings and then list them out and it should work out of the box.

`/src/pages/blog/post/[slug].astro`
```astro
---
export async function getStaticPaths() {
  const posts = await getCollection("blog");

  const headings = await Promise.all(
    posts.map(async (post) => {
      const data = await render(post);
      return data.headings;
    }),
  );

  return posts.map((post, index) => ({
    params: { slug: post.id },
    props: { post, headings: headings[index] },
  }));
}

const { post, headings } = Astro.props;
const { Content } = await render(post);
---

<table-of-contents>
  <nav id="toc" class="overflow-y-auto">
    <h2 class="border-theme border-b py-2 text-lg font-semibold">
      Table of Contents
    </h2>
    <ul class="list-inside py-2">
      {
        headings.map((heading) => (
          <li><a href={heading.slug}>{heading.text}</a></li>
        ))
      }
    </ul>
  </nav>
</table-of-contents>
```

One drawback of Astro's headings method is that it returns a flat list of headings in order with their depth starting from 1 for the title and then 2 for subheadings, 3 for the subsubheadings and so on. It is easier if we construct a tree of headings with children of top level headings as a list within the heading. It would have taken me some time for me to understand the rules of the headings and whether they are properly sorted based on where they appear so instead I followed [this tutorial by Kevin Drum](https://kld.dev/building-table-of-contents/#building-a-nested-table-of-contents-array) to construct the nested list.

To round it all off, I wanted the headings to highlight if they were on screen as you scrolled. I started looking into the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) but it felt like I was already spending too much time so I decided to simply follow [this tutorial by Fazza Razaq Amiarso](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25) to highlight headings with some minor tweaks so it would highlight all headers currently in view. There was an issue with sections not highlighting if there are no headers on the screen at any given time so to mitigate that, I followed [this article by Billy Le](https://billyle.dev/posts/highlight-table-of-content-items-using-intersection-observer) which recommended using the remark plugin `remark-sectionize`. This plugin ensures that each section and subsection under a header is nested rather than the default of rendering as a flat list of tags. This mitigated the issue completely.

### View Transitions

Adding basic View Transitions that blur pages into view as you move between them is as easy as simple adding a [single component in your head tag](https://docs.astro.build/en/guides/view-transitions/#adding-view-transitions-to-a-page). This is basically hooking into default browser behaviour with graceful fallbacks for unsupported browsers.

To transition elements or titles between pages, you use the `transition:name` property on each element on both pages. To transition the image between the blog list and the blog page I added ``transition:name={`blog-hero-image-${post-id}`}`` to the hero image tag on both pages.

`/src/pages/blog/[page].astro`
```html
<img
  width={800}
  height={400}
  src={post.data.heroImage}
  alt={post.data.title}
  transition:name={`blog-hero-image-${post.id}`}
/>
```

`/src/pages/blog/[page].astro`
```html
<img
  width={1020}
  height={510}
  src={heroImage}
  alt={title}
  class="border-theme m-auto aspect-2/1 xl:border-x"
  transition:name={`blog-hero-image-${id}`}
/>
```

You can transition more elements including the headers, post dates etc but it looked too flashy and distracting so I opted to stick with the image itself. Adding the transition to the post items entirely let me animate between different tags which is actually a much better use of the view transitions so common posts will stay when you are on the list of all blog posts and the list of an individual tag.

## Publication

I decided to host the site on Netlify since it has a reasonable free tier with 100GB of bandwitch and... let's be honest this site is not getting anywhere close to that. Connecting Netlify to the GitHub repo is incredibly simple and that enables deploys on every push. Good enough. To make the process fully smooth for Netlify's serverless environment you need to run `npx astro add netlify` which adds a Netlify integration. A `netlify.toml` file with basic environment configuration, point my DNS to the Netlify page and I was Gucci.

## Conclusion

While it took a while to fully flesh everything out, building this was a great undertaking that I really wanted to do because I wanted a reasonably pretty website that I could call my own. Overall, I am very much pleased with how it turned out and it would not have been possible without all the open source packages and tutorials written by the people I found. I highly recommend doing this exercise yourself and making your own custom place on the internet.

---

## References

All these links do not include all the dependent open source packages installed using
npm and their authors to whom I am forever grateful.

### Inspiration

- Design heavily inspired by [this website by Zak Archer](https://zakarcher.com/)
- General content and design inspiration from [the website of Ariel Salminen](https://arielsalminen.com/)

### Tutorials

- Dark mode code from [this tutorial by Kevin Zuniga Cueller](https://www.kevinzc.com/blog/dark-mode-in-astro/)
- Code for the contact form heavily inspired by [this tutorial by "Web Reaper"](https://cosmicthemes.com/blog/astro-effective-contact-form/)
- Table of contents for the blog posts aided by [this tutorial by Noah Falk](https://noahflk.com/blog/astro-table-of-contents)
- Function to nest the Astro headers from [this tutorial by Kevin Drum](https://kld.dev/building-table-of-contents/#building-a-nested-table-of-contents-array)
- Scroll spy for the table of contents made prettier with help from [this tutorial by Fazza Razaq Amiarso](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25)
- Fix for events when using View Transitions aided by [this article by Cristian Perez Rodriguez](https://www.cpr.name/blog/astro-event-handling)

### Resources

- Static Site Generation powered by [Astro](https://astro.build/)
- Styling powered by [Tailwind](https://tailwindcss.com/)
  - Also using the [Tailwind Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography) (though the documentation seems outdated for Tailwind 4)
- Tooltips using [TippyJS](https://atomiks.github.io/tippyjs/)
- Icons in general copied from [Remix Icon](https://remixicon.com/)
- Icons for programming technologies sourced from [Devicon](https://devicon.dev/)
- Cursive font for headings is [Victor Mono](https://fonts.google.com/specimen/Victor+Mono)
- General website font is [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

### Deployment

The site is deployed to [Netlify](https://www.netlify.com/), connected to my GitHub account so it is deployed fresh on every push on the repository to GitHub.
