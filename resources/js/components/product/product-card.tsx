import { Link } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductCard({
    product,
    view = 'grid',
}: {
    product: Product;
    view?: 'grid' | 'list';
}) {
    const discount = product.compareAtPrice
        ? Math.round(
              (1 - Number(product.price) / Number(product.compareAtPrice)) *
                  100,
          )
        : null;

    return (
        <article
            className={cn(
                'group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl',
                view === 'list' && 'sm:flex',
            )}
        >
            <div
                className={cn(
                    'relative aspect-square overflow-hidden bg-slate-100',
                    view === 'list' && 'sm:w-56 sm:shrink-0',
                )}
            >
                <Link href={`/products/${product.slug}`}>
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    )}
                </Link>
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
            <div className={cn('p-4', view === 'list' && 'flex-1 sm:p-6')}>
                <p className="text-xs font-bold tracking-wide text-brand-cyan uppercase">
                    {product.category}
                </p>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 min-h-12 font-bold text-slate-900 transition hover:text-brand-blue">
                        {product.name}
                    </h3>
                </Link>
                {view === 'list' && (
                    <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-slate-500 sm:block">
                        {product.description}
                    </p>
                )}
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
