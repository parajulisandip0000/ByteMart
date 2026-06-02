import { Link } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNpr } from '@/lib/currency';
import {
    productToStorefrontItem,
    useCart,
    useWishlist,
} from '@/lib/storefront-storage';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductCard({
    product,
    view = 'grid',
}: {
    product: Product;
    view?: 'grid' | 'list';
}) {
    const cart = useCart();
    const wishlist = useWishlist();
    const storefrontItem = productToStorefrontItem(product);
    const wishlisted = wishlist.hasItem(product.id);
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
                    'relative h-56 w-full overflow-hidden bg-white flex items-center justify-center border-b border-slate-100',
                    view === 'list' && 'sm:w-56 sm:h-56 sm:shrink-0 sm:border-b-0 sm:border-r',
                )}
            >
                <Link href={`/products/${product.slug}`} title={product.name} className="w-full h-full flex items-center justify-center">
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full max-h-full w-auto max-w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                        />
                    )}
                </Link>
                {discount && (
                    <span className="absolute top-3 left-3 rounded-full bg-brand-orange px-2.5 py-1 text-xs font-extrabold text-white">
                        -{discount}%
                    </span>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-3 right-3 rounded-full bg-white/90"
                            aria-label={`${wishlisted ? 'Remove' : 'Add'} ${product.name} ${wishlisted ? 'from' : 'to'} wishlist`}
                            onClick={() => wishlist.toggleItem(storefrontItem)}
                        >
                            <Heart
                                className={
                                    wishlisted
                                        ? 'fill-brand-orange text-brand-orange'
                                        : ''
                                }
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {wishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'}
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className={cn('p-4', view === 'list' && 'flex-1 sm:p-6')}>
                <p className="text-xs font-bold tracking-wide text-brand-cyan uppercase">
                    {product.category}
                </p>
                <Link href={`/products/${product.slug}`} title={product.name}>
                    <h3 className="mt-1 line-clamp-1 font-bold text-slate-900 transition hover:text-brand-blue">
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                className="rounded-full bg-brand-blue"
                                aria-label={`Add ${product.name} to cart`}
                                disabled={!product.inStock}
                                onClick={() => cart.addItem(storefrontItem)}
                            >
                                <ShoppingBag />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {product.inStock ? 'Add to cart' : 'Out of stock'}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </article>
    );
}
