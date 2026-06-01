import { Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
    const discount = product.compareAtPrice
        ? Math.round(
              (1 - Number(product.price) / Number(product.compareAtPrice)) *
                  100,
          )
        : null;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                {product.imageUrl && (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                )}
                {discount && (
                    <span className="absolute top-3 left-3 rounded-full bg-brand-orange px-2.5 py-1 text-xs font-extrabold text-white">
                        -{discount}%
                    </span>
                )}
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-white/90"
                    aria-label={`Add ${product.name} to wishlist`}
                >
                    <Heart />
                </Button>
            </div>
            <div className="p-4">
                <p className="text-xs font-bold tracking-wide text-brand-cyan uppercase">
                    {product.category}
                </p>
                <h3 className="mt-1 min-h-12 font-bold text-slate-900">
                    {product.name}
                </h3>
                <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                        <p className="font-black text-brand-blue">
                            {formatNpr(product.price)}
                        </p>
                        {product.compareAtPrice && (
                            <p className="text-xs text-slate-400 line-through">
                                {formatNpr(product.compareAtPrice)}
                            </p>
                        )}
                    </div>
                    <Button
                        size="icon"
                        className="rounded-full bg-brand-blue"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingBag />
                    </Button>
                </div>
            </div>
        </article>
    );
}
