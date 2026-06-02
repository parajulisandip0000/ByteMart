import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { useCart } from '@/lib/storefront-storage';

export default function Cart() {
    const cart = useCart();

    return (
        <>
            <Head title="Shopping cart" />
            <StorefrontLayout>
                <section className="border-b border-blue-800 bg-brand-blue text-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                            Your order
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">
                            Shopping cart
                        </h1>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {cart.items.length > 0 ? (
                        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                {cart.items.map((item) => (
                                    <article
                                        key={item.id}
                                        className="flex gap-4 border-b border-slate-200 p-4 last:border-0 sm:gap-6 sm:p-6"
                                    >
                                        <Link href={`/products/${item.slug}`}>
                                            <img
                                                src={item.imageUrl ?? ''}
                                                alt={item.name}
                                                className="size-24 rounded-2xl bg-slate-100 object-cover sm:size-32"
                                            />
                                        </Link>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <p className="text-xs font-bold tracking-wide text-brand-cyan uppercase">
                                                {item.category}
                                            </p>
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="mt-1 font-black text-slate-900 hover:text-brand-blue"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-2 font-black text-brand-blue">
                                                {formatNpr(item.price)}
                                            </p>
                                            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                                                <div className="flex items-center rounded-full border border-slate-200">
                                                    <button
                                                        type="button"
                                                        aria-label={`Decrease ${item.name} quantity`}
                                                        onClick={() =>
                                                            cart.setQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        className="p-2 text-slate-600 hover:text-brand-blue"
                                                    >
                                                        <Minus className="size-4" />
                                                    </button>
                                                    <span className="min-w-8 text-center text-sm font-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Increase ${item.name} quantity`}
                                                        onClick={() =>
                                                            cart.setQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        className="p-2 text-slate-600 hover:text-brand-blue"
                                                    >
                                                        <Plus className="size-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cart.removeItem(item.id)
                                                    }
                                                    className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="size-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-black text-slate-950">
                                    Order summary
                                </h2>
                                <div className="mt-5 grid gap-3 border-b border-slate-200 pb-5 text-sm">
                                    <p className="flex justify-between">
                                        <span className="text-slate-500">
                                            Subtotal
                                        </span>
                                        <strong>
                                            {formatNpr(cart.subtotal)}
                                        </strong>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-slate-500">
                                            Delivery
                                        </span>
                                        <span>Calculated at checkout</span>
                                    </p>
                                </div>
                                <p className="mt-5 flex justify-between text-lg">
                                    <strong>Total</strong>
                                    <strong className="text-brand-blue">
                                        {formatNpr(cart.subtotal)}
                                    </strong>
                                </p>
                                <Button
                                    className="mt-6 w-full bg-brand-orange font-bold"
                                    size="lg"
                                    disabled
                                >
                                    Checkout coming next
                                </Button>
                                <Link
                                    href="/shop"
                                    className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-orange"
                                >
                                    <ArrowLeft className="size-4" />
                                    Continue shopping
                                </Link>
                            </aside>
                        </div>
                    ) : (
                        <EmptyCart />
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}

function EmptyCart() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto size-14 text-brand-cyan" />
            <h2 className="mt-5 text-2xl font-black text-slate-950">
                Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-500">
                Add products from the shop and they will appear here ready for
                checkout.
            </p>
            <Button asChild className="mt-6 bg-brand-orange font-bold">
                <Link href="/shop">Browse products</Link>
            </Button>
        </div>
    );
}
