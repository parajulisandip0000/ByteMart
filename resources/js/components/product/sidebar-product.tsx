import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

import { formatNpr } from '@/lib/currency';
import type { Product } from '@/types';

export function SidebarProduct({ product }: { product: Product }) {
    return (
        <article className="flex gap-3">
            <Link
                href={`/products/${product.slug}`}
                className="size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
            >
                {product.imageUrl && (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="size-full object-cover"
                    />
                )}
            </Link>
            <div className="min-w-0">
                <Link
                    href={`/products/${product.slug}`}
                    title={product.name}
                    className="line-clamp-2 text-sm font-bold text-slate-800 transition hover:text-brand-blue"
                >
                    {product.name}
                </Link>
                <div
                    className="mt-1 flex gap-0.5 text-brand-yellow"
                    aria-label="5 out of 5 stars"
                >
                    {Array.from({ length: 5 }, (_, index) => (
                        <Star className="size-3 fill-current" key={index} />
                    ))}
                </div>
                <p className="mt-1 text-sm font-black text-brand-blue">
                    {formatNpr(product.price)}
                </p>
            </div>
        </article>
    );
}
