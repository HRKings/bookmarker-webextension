import type { IOpenGraph } from '~/types/OpenGraph'

export function getOpenGraphTags(document: Document): IOpenGraph {
  const metas = document.getElementsByTagName('meta')
  const result: IOpenGraph = {}

  const ogTags: Record<string, string|undefined> = {}
  for (const meta of Object.values(metas)) {
    const property = meta.getAttribute('property')

    if (!property || !property.startsWith('og:'))
      continue

    const ogProp = property.replace('og:', '')

    if (ogProp && !ogTags[ogProp])
      ogTags[ogProp] = meta.getAttribute('content') ?? undefined
  }

  if (ogTags.site_url)
    result.title = ogTags.site_url

  if (ogTags.title && result.title)
    result.title = `${result.title} | ${ogTags.title}`

  result.title = result.title ?? ogTags.title ?? document.getElementsByTagName('title')[0].innerText
  result.description = ogTags.description
  result.ogType = ogTags.type
  result.imageUrl = ogTags.image ?? ogTags['image:url']
  result.videoUrl = ogTags.video ?? ogTags['video:url']
  result.imageAlt = ogTags['image:alt']

  return result
}
