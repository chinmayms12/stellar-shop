import type { Brand, Category, Offer, Product, Review } from '@/types';

/** Runtime catalog state. Products are loaded from Supabase at application startup. */
export const products: Product[] = [];
export const categories: Category[] = [];
export const brands: Brand[] = [];
export const offers: Offer[] = [];
export const coupons: { code: string; description: string; type: string }[] = [];
export const customerReviews: Review[] = [];

export const productMap: Record<string, Product> = Object.create(null);
export const productBySlug: Record<string, Product> = Object.create(null);

export function replaceProducts(next: Product[]) {
  products.splice(0, products.length, ...next);
  for (const key of Object.keys(productMap)) delete productMap[key];
  for (const key of Object.keys(productBySlug)) delete productBySlug[key];
  for (const product of next) {
    productMap[product.id] = product;
    productBySlug[product.slug] = product;
  }
  rebuildDerivedCatalog(next);
}

function rebuildDerivedCatalog(items: Product[]) {
  categories.splice(0, categories.length);
  brands.splice(0, brands.length);

  const categoryMap = new Map<string, Category>();
  const brandMap = new Map<string, Brand>();
  const brandColors = ['#3366ff', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

  for (const product of items) {
    const categoryKey = product.categoryId || product.category;
    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, {
        id: product.categoryId || product.category,
        name: product.category,
        slug: product.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        icon: 'Package',
        image: product.images[0] || '/branding/product-placeholder.svg',
        productCount: 0,
      });
    }
    categoryMap.get(categoryKey)!.productCount += 1;

    const brandKey = product.brandId || product.brand;
    if (!brandMap.has(brandKey)) {
      brandMap.set(brandKey, {
        id: product.brandId || product.brand,
        name: product.brand,
        slug: product.brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        logoColor: brandColors[brandMap.size % brandColors.length],
      });
    }
  }

  categories.push(...categoryMap.values());
  brands.push(...brandMap.values());
}

export function productsByTag(tag: string) {
  return products.filter((product) => product.tags.includes(tag));
}

export function productsByCategory(categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId);
}

export function formatINR(value: number) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

export function discountPercent(product: Product) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}
