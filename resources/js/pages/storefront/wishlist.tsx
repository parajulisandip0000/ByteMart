import { Head, Link } from '@inertiajs/react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { useCart, useWishlist } from '@/lib/storefront-storage';

export default function Wishlist() {
    const cart = useCart();
    const wishlist = useWishlist();

    return (
        <>
            <Head title="Wishlist" />
            <StorefrontLayout>
                <section className="border-b border-blue-800 bg-brand-blue text-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                            Saved products
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">
                            My wishlist
                        </h1>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {wishlist.items.length > 0 ? (
                        <div className="grid gap-4">
                            {wishlist.items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-6"
                                >
                                    <Link href={`/products/${item.slug}`}>
                                        <img
                                            src={item.imageUrl ?? ''}
                                            alt={item.name}
                                            className="size-24 rounded-xl bg-slate-100 object-cover"
                                        />
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold tracking-wide text-brand-cyan uppercase">
                                            {item.category}
                                        </p>
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="mt-1 block font-black text-slate-900 hover:text-brand-blue"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-2 font-black text-brand-blue">
                                            {formatNpr(item.price)}
                                        </p>
                                    </div>
                                    <div className="ml-auto flex flex-wrap gap-2">
                                        <Button
                                            disabled={!item.inStock}
                                            className="bg-brand-blue font-bold"
                                            onClick={() => cart.addItem(item)}
                                        >
                                            <ShoppingBag /> Add to cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            aria-label={`Remove ${item.name} from wishlist`}
                                            onClick={() =>
                                                wishlist.removeItem(item.id)
                                            }
                                        >
                                            <Trash2 /> Remove
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                            <Heart className="mx-auto size-14 text-brand-cyan" />
                            <h2 className="mt-5 text-2xl font-black text-slate-950">
                                Your wishlist is empty
                            </h2>
                            <p className="mx-auto mt-2 max-w-lg text-slate-500">
                                Save products you like and return to them
                                whenever you are ready.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-orange font-bold"
                            >
                                <Link href="/shop">Explore the shop</Link>
                            </Button>
                        </div>
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}
