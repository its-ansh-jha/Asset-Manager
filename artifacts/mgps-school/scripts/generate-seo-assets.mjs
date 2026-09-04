import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(appDirectory, "public");
const configuredUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
const siteUrl = (configuredUrl || deploymentUrl || "").replace(/\/$/, "");

if (!siteUrl) {
  console.log("SEO crawl file generation skipped: set SITE_URL for production or use VERCEL_URL.");
  process.exit(0);
}

const pages = [
  ["/", "weekly", "1.0"],
  ["/about", "monthly", "0.8"],
  ["/academics", "monthly", "0.9"],
  ["/faculty", "monthly", "0.7"],
  ["/admissions", "weekly", "0.9"],
  ["/notices", "daily", "0.9"],
  ["/gallery", "weekly", "0.7"],
  ["/achievements", "monthly", "0.6"],
  ["/facilities", "monthly", "0.7"],
  ["/contact", "monthly", "0.8"],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(([pathname, changefreq, priority]) => `  <url>
    <loc>${siteUrl}${pathname}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# Maa Gayatri Public School

> Maa Gayatri Public School is an English-medium co-educational school in Muzaffarpur, Bihar.

## Official information

- [About the school](${siteUrl}/about)
- [Academics and classes](${siteUrl}/academics)
- [Online admission enquiry](${siteUrl}/admissions)
- [Notices and announcements](${siteUrl}/notices)
- [Facilities](${siteUrl}/facilities)
- [Contact and location](${siteUrl}/contact)

For current admissions, class availability and official updates, contact the school directly through its contact page.
`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDirectory, "sitemap.xml"), sitemap),
  writeFile(path.join(outputDirectory, "robots.txt"), robots),
  writeFile(path.join(outputDirectory, "llms.txt"), llms),
]);

console.log(`SEO crawl files generated for ${siteUrl}`);
