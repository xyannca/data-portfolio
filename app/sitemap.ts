import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://data-portfolio-pied.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://data-portfolio-pied.vercel.app/dashboard',
      lastModified: new Date(),
    },
    {
      url: 'https://data-portfolio-pied.vercel.app/projects',
      lastModified: new Date(),
    },
    {
        url: 'https://data-portfolio-pied.vercel.app/about',
        lastModified: new Date(),
    },
  ]
}