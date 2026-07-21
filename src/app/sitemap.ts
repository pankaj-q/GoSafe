import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://gosafe.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: { source: true, dest: true },
    })

    const routePages: MetadataRoute.Sitemap = routes.map(route => ({
      url: `${BASE_URL}/search?source=${encodeURIComponent(route.source.name)}&destination=${encodeURIComponent(route.dest.name)}&date=${new Date().toISOString().split('T')[0]}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))

    const cities = await prisma.city.findMany({
      where: { isActive: true },
    })

    const cityPages: MetadataRoute.Sitemap = cities.flatMap(city =>
      cities
        .filter(c => c.id !== city.id)
        .slice(0, 5)
        .map(dest => ({
          url: `${BASE_URL}/search?source=${encodeURIComponent(city.name)}&destination=${encodeURIComponent(dest.name)}&date=${new Date().toISOString().split('T')[0]}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    )

    return [...staticPages, ...routePages, ...cityPages]
  } catch {
    return staticPages
  }
}
