import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("blog");
  const items = posts.map((post) => ({
    ...post.data,
    link: `/blog/${post.id}/`,
    content: sanitizeHtml(parser.render(post.body), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    }),
  }));

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
    site: context.site,
    items,
  });
}
