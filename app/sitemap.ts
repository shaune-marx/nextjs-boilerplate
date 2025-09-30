import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://todaysplaydate.com";
  const lastModified = new Date().toISOString().slice(0, 10);

  return [
    { url: `${base}/`, lastModified },
      { url: `${base}/about`, lastModified },
    { url: `${base}/privacy`, lastModified },
    { url: `${base}/terms`, lastModified },
  ];
}
