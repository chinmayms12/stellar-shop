import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, RotateCcw, Star, Quote } from 'lucide-react';
import { products, productsByTag, categories, brands, offers, customerReviews } from '@/catalog';
import { useAppSelector } from '@/redux/store';
import { ProductSection } from '@/components/product/ProductSection';
import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Countdown } from '@/components/home/Countdown';

export function Home() {
  const recentlyViewed = useAppSelector((s) => s.recentlyViewed);
  const recentlyViewedProducts = recentlyViewed.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  const heroProducts = products.slice(0, 3);
  const flashProducts = productsByTag('flash').slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      <section className="relative mt-4 overflow-hidden rounded-card">
        {heroProducts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {heroProducts.map((p, index) => (
              <Link key={p.id} to={`/product/${p.slug}`} className={`group relative overflow-hidden rounded-card border border-base ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img src={p.images[0] || '/branding/product-placeholder.svg'} alt={p.name} className={`w-full object-cover transition duration-500 group-hover:scale-105 ${index === 0 ? 'h-[360px] md:h-[520px]' : 'h-[250px] md:h-[255px]'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <Badge variant="stellar" className="mb-2">{index === 0 ? 'Featured' : 'In catalog'}</Badge>
                  <h1 className="font-display text-2xl font-extrabold md:text-4xl">{p.name}</h1>
                  <p className="mt-1 text-sm text-white/80">{p.brand} · {p.category}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-card border border-base bg-soft p-8 text-center">
            <div><Badge variant="stellar">Stellar Shop</Badge><h1 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">Your store is ready</h1><p className="mx-auto mt-2 max-w-xl text-sm text-muted">Add products from the administrator dashboard and they will appear here automatically.</p><Link to="/admin-login"><Button className="mt-5">Open admin dashboard <ArrowRight className="h-4 w-4" /></Button></Link></div>
          </div>
        )}
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Truck, t: 'Free shipping', s: 'Over ₹499' },
          { icon: Shield, t: 'Secure payments', s: 'Protected checkout' },
          { icon: RotateCcw, t: '10-day returns', s: 'Easy returns' },
          { icon: Zap, t: 'Fast delivery', s: 'Available by location' },
        ].map((x) => <div key={x.t} className="flex items-center gap-3 rounded-xl border border-base bg-elevated p-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-stellar-500/10 text-stellar-500"><x.icon className="h-5 w-5" /></div><div><p className="text-sm font-semibold">{x.t}</p><p className="text-xs text-muted">{x.s}</p></div></div>)}
      </section>

      {flashProducts.length > 0 && <section className="mt-8 overflow-hidden rounded-card border border-base gradient-hero"><div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><Zap className="h-5 w-5 text-warning-500" /><h2 className="text-xl font-bold md:text-2xl">Flash Sale</h2></div><p className="mt-1 text-sm text-muted">Products currently marked for flash sale.</p></div>{offers[0] && <Countdown target={offers[0].endsAt} />}</div><div className="grid grid-cols-2 gap-4 px-5 pb-5 md:grid-cols-4">{flashProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div></section>}

      <ProductSection title="Today's Deals" badge="Hot" products={productsByTag('today')} viewAllTo="/offers" />
      <ProductSection title="Featured Electronics" products={productsByTag('featured')} viewAllTo="/search?q=featured" />
      <ProductSection title="Trending Products" badge="Trending" products={productsByTag('trending')} viewAllTo="/search?q=trending" />

      {categories.length > 0 && <section className="py-6"><h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Categories</h2><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{categories.slice(0, 12).map((c, i) => <motion.div key={c.id} initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .03 }}><Link to={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 rounded-card border border-base bg-elevated p-4 hover:-translate-y-1 hover:shadow-soft"><img src={c.image} alt={c.name} className="h-16 w-16 rounded-xl object-cover transition group-hover:scale-110" /><p className="text-center text-xs font-semibold">{c.name}</p><p className="text-[11px] text-muted">{c.productCount} products</p></Link></motion.div>)}</div></section>}

      <ProductSection title="Best Sellers" badge="Top" products={productsByTag('bestseller')} viewAllTo="/search?q=bestseller" />
      <ProductSection title="New Arrivals" badge="New" products={productsByTag('new')} viewAllTo="/search?q=new" />
      <ProductSection title="Recommended For You" products={[...products].sort((a, b) => b.rating - a.rating).slice(0, 10)} viewAllTo="/search?q=recommended" />

      {offers.length > 0 && <section className="py-6"><div className="grid gap-4 md:grid-cols-3">{offers.slice(0, 3).map((o) => <Link key={o.id} to="/offers" className="group relative overflow-hidden rounded-card border border-base"><img src={o.image} alt={o.title} className="h-40 w-full object-cover transition group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" /><div className="absolute bottom-0 p-4"><Badge variant="stellar">{o.discount}</Badge><h3 className="mt-2 text-lg font-bold text-white">{o.title}</h3><p className="text-sm text-white/80">{o.subtitle}</p></div></Link>)}</div></section>}

      {brands.length > 0 && <section className="py-6"><h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Popular Brands</h2><div className="flex flex-wrap gap-3">{brands.map((b) => <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-base bg-elevated px-5 py-3"><div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ backgroundColor: b.logoColor + '20', color: b.logoColor }}>{b.name.charAt(0)}</div><span className="font-semibold">{b.name}</span></div>)}</div></section>}

      {recentlyViewedProducts.length > 0 && <ProductSection title="Recently Viewed" products={recentlyViewedProducts} viewAllTo="/recently-viewed" />}

      {customerReviews.length > 0 && <section className="py-6"><h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Customer Reviews</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{customerReviews.map((r) => <div key={r.id} className="rounded-card border border-base bg-elevated p-5"><Quote className="h-6 w-6 text-stellar-500/40" /><p className="mt-2 text-sm text-muted">{r.body}</p><div className="mt-4 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full gradient-stellar text-sm font-bold text-white">{r.author.charAt(0)}</div><div><p className="text-sm font-semibold">{r.author}</p><div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />)}</div></div></div></div>)}</div></section>}

      <section className="py-6"><div className="grid gap-4 md:grid-cols-3">{[{ icon: RotateCcw, t: '10-Day Returns', s: 'Return eligible items according to the store return policy.' },{ icon: Shield, t: 'Warranty', s: 'Warranty information is shown on each product.' },{ icon: Truck, t: 'Delivery', s: 'Delivery availability is shown during checkout.' }].map((x) => <div key={x.t} className="rounded-card border border-base bg-elevated p-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-stellar-500/10 text-stellar-500"><x.icon className="h-5 w-5" /></div><h3 className="mt-3 font-bold">{x.t}</h3><p className="mt-1 text-sm text-muted">{x.s}</p></div>)}</div></section>
    </div>
  );
}
