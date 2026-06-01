import { notFound } from 'next/navigation'
import { products, getProductBySlug } from '@/lib/products'
import ProductPage from './ProductPage'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.tag} | The Digital Product Blueprint™`,
    description: product.subheadline,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  return <ProductPage product={product} />
}
