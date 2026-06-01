import { Head, Link } from '@inertiajs/react';
import { Heart, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

import { SectionHeading } from '@/components/home/section-heading';
import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import type { Product, ProductDetail } from '@/types';

export default function ProductPage({
    product,
    relatedProducts,
}: {
    product: ProductDetail;
    relatedProducts: Product[];
}) {
    return (
        <>
            <Head title={product.name} />
            <StorefrontLayout>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6 text-sm text-slate-500">
                        <Link href="/shop" className="hover:text-brand-blue">
                            Shop
                        </Link>
                        <span> / </span>
                        {product.categorySlug && (
                            <Link
                                href={`/categories/${product.categorySlug}`}
                                className="hover:text-brand-blue"
                            >
                                {product.category}
                            </Link>
                        )}
                        <span> / {product.name}</span>
                    </div>
                    <div className="grid gap-9 lg:grid-cols-2">
                        <div className="overflow-hidden rounded-3xl bg-white">
                            {product.images[0] && (
                                <img
                                    src={product.images[0].url}
                                    alt={
                                        product.images[0].altText ??
                                        product.name
                                    }
                                    className="aspect-square w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="py-3">
                            <p className="text-xs font-black tracking-[0.2em] text-brand-cyan uppercase">
                                {product.category}
                            </p>
                            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                                {product.name}
                            </h1>
                            <div className="mt-5 flex items-end gap-3">
                                <p className="text-3xl font-black text-brand-blue">
                                    {formatNpr(product.variant.price)}
                                </p>
                                {product.variant.compareAtPrice && (
                                    <p className="pb-1 text-lg text-slate-400 line-through">
                                        {formatNpr(
                                            product.variant.compareAtPrice,
                                        )}
                                    </p>
                                )}
                            </div>
                            <p className="mt-6 leading-7 text-slate-600">
                                {product.description}
                            </p>
                            <p className="mt-5 text-sm font-bold text-slate-700">
                                SKU:{' '}
                                <span className="font-medium text-slate-500">
                                    {product.variant.sku}
                                </span>
                            </p>
                            <p
                                className={`mt-2 text-sm font-bold ${product.variant.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}
                            >
                                {product.variant.stockQuantity > 0
                                    ? `${product.variant.stockQuantity} items in stock`
                                    : 'Out of stock'}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-brand-orange px-8 font-bold"
                                    disabled={
                                        product.variant.stockQuantity === 0
                                    }
                                >
                                    <ShoppingBag /> Add to cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-6 font-bold"
                                >
                                    <Heart /> Add to wishlist
                                </Button>
                            </div>
                            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-2">
                                <p className="flex gap-2">
                                    <Truck className="size-5 text-brand-blue" />{' '}
                                    Delivery across Nepal
                                </p>
                                <p className="flex gap-2">
                                    <ShieldCheck className="size-5 text-brand-blue" />{' '}
                                    Secure shopping
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {relatedProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="More to explore"
                            title="Related products"
                        />
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}
            </StorefrontLayout>
        </>
    );
}
