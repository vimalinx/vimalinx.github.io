import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.resolve(import.meta.dirname, '../content/blog');
const PUBLIC_DIR = path.resolve(import.meta.dirname, '../public');
const SITE_URL = 'https://vimalinx.xyz';

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

function getPosts(): PostMeta[] {
  const posts: PostMeta[] = [];
  const slugs = fs.readdirSync(BLOG_DIR).filter(d =>
    fs.statSync(path.join(BLOG_DIR, d)).isDirectory()
  );

  for (const slug of slugs) {
    // Prefer zh, fallback to en
    const langFile = fs.existsSync(path.join(BLOG_DIR, slug, 'zh.md')) ? 'zh.md' : 'en.md';
    const fp = path.join(BLOG_DIR, slug, langFile);
    const raw = fs.readFileSync(fp, 'utf-8');
    const { data, content } = matter(raw);

    // Skip drafts
    if (data.draft) continue;

    posts.push({
      slug,
      title: data.title || slug,
      date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
      excerpt: data.excerpt || '',
      content: content.slice(0, 500),
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts.slice(0, 20);
}

function generateRSS(posts: PostMeta[]): string {
  const items = posts.map(p => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vimalinx Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Exploring the boundary between code and art</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function generateSitemap(posts: PostMeta[]): string {
  const urls = [
    `  <url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq></url>`,
    `  <url><loc>${SITE_URL}/blog</loc><changefreq>daily</changefreq></url>`,
    `  <url><loc>${SITE_URL}/blog/archive</loc><changefreq>weekly</changefreq></url>`,
  ];

  for (const p of posts) {
    urls.push(`  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Run
const posts = getPosts();

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), generateRSS(posts));
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(posts));
console.log(`Generated feed.xml and sitemap.xml (${posts.length} posts)`);