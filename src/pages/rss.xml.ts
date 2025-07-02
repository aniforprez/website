import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog");
  const items: RSSFeedItem[] = posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      ...post.data,
      author: "Anirudh S",
      link: `/blog/post/${post.id}/`,
      content: `<img src="${context.site + post.data.heroImage.src}"
                  alt="${post.data.title}" /><br/>
                  <p>${post.data.description}</p>`,
    }));

  const reviews = await getCollection("reviews");
  reviews
    .filter((rev) => !rev.data.draft)
    .map((review) =>
      items.push({
        ...review.data,
        author: "Anirudh S",
        link: `/blog/review/${review.id}/`,
        content: `<img src="${context.site + review.data.heroImage.src}"
                    alt="${review.data.title}" /><br/>
                    <p>${review.data.description}</p>`,
      }),
    );

  const recommends = await getCollection("articles");
  recommends.map((rec) =>
    items.push({
      title: rec.data.title,
      link: rec.data.link,
      description: rec.data.description,
      content: rec.data.description,
      author: rec.data.author,
      pubDate: rec.data.pubDate,
      categories: rec.data.categories,
    }),
  );

  return rss({
    title: "Anirudh Sylendranath's Blog",
    description: "Posts from my personal blog",
    site: context.site!,
    items,
  });
};
