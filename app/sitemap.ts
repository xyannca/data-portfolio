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
      url: 'https://data-portfolio-pied.vercel.app/ai-projects',
      lastModified: new Date(),
    },
    {
      url: 'https://data-portfolio-pied.vercel.app/clearsight',
      lastModified: new Date(),
    },
    {
      url: 'https://data-portfolio-pied.vercel.app/deep-sight',
      lastModified: new Date(),
    },
    {
        url: 'https://data-portfolio-pied.vercel.app/about',
        lastModified: new Date(),
    },
  ]
}