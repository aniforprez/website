import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";

// Recommended articles
const articles = defineCollection({
  loader: file("./src/content/articles.json", {
    parser: (text) => JSON.parse(text)["articles"],
  }),

  schema: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    link: z.string().url(),
    categories: z.array(z.string()).refine((val) => val.push("recommend")),
    type: z.enum(["article", "video"]).default("article"),
  }),
});

// Blog pages
const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    rssSchema
      .extend({
        title: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: image(),
        draft: z.boolean().optional().default(false),
        type: z.string().default("blog"),
      })
      .refine((val) =>
        val.categories
          ? val.categories.push("blog")
          : (val.categories = ["blog"]),
      ),
});

// Reviews
const reviews = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/reviews", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    rssSchema
      .extend({
        title: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: image(),
        boxArt: z.string().optional(),
        rating: z.number().max(10),
        draft: z.boolean().optional().default(false),
        type: z.string().default("review"),
        mediaType: z.enum([
          "manga",
          "book",
          "movie",
          "video game",
          "visual novel",
        ]),
      })
      .refine((val) =>
        val.categories
          ? val.categories.push("review")
          : (val.categories = ["review"]),
      ),
});

export const collections = { articles, blog, reviews };
