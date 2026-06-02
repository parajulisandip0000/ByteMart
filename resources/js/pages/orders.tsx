import { Head, Link } from '@inertiajs/react';
import { PackageCheck, ShoppingBag, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { useOrders } from '@/lib/storefront-storage';
import { dashboard } from '@/routes';

export default function Orders() {
    const orders = useOrders();

    return (
        <>
            <Head title="My orders" />
            <div className="flex flex-1 flex-col gap-7 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                <section className="overflow-hidden rounded-3xl bg-brand-blue px-6 py-7 text-white sm:px-8 sm:py-9">
                    <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                        ByteMart account
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        My orders
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                        Review your ByteMart order history and delivery status
                        from one place.
                    </p>
                </section>
                {orders.items.length > 0 ? (
                    <section className="grid gap-4">
                        {orders.items.map((order) => (
                            <article
                                key={order.reference}
                                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                                    <div>
                                        <p className="text-xs font-black tracking-[0.15em] text-brand-orange uppercase">
                                            Order {order.reference}
                                        </p>
                                        <h2 className="mt-2 text-xl font-black text-slate-950">
                                            {formatOrderDate(order.createdAt)}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {order.deliveryAddress}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-brand-sky/50 px-3 py-1 text-xs font-black text-brand-blue">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="grid gap-3 py-5">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3"
                                        >
                                            <img
                                                src={item.imageUrl ?? ''}
                                                alt={item.name}
                                                className="size-14 rounded-lg bg-slate-100 object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                    className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-brand-blue"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <strong className="text-sm text-brand-blue">
                                                {formatNpr(
                                                    Number(item.price) *
                                                        item.quantity,
                                                )}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                                    <div className="text-sm text-slate-500">
                                        <p>{order.deliveryLabel}</p>
                                        <p>{order.paymentLabel}</p>
                                    </div>
                                    <p className="text-lg">
                                        <span className="mr-3 text-sm text-slate-500">
                                            Total
                                        </span>
                                        <strong className="text-brand-blue">
                                            {formatNpr(order.total)}
                                        </strong>
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <EmptyOrders />
                )}
            </div>
        </>
    );
}

function EmptyOrders() {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-8">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-sky/50 text-brand-blue">
                <PackageCheck className="size-8" />
            </span>
            <h2 className="mt-5 text-2xl font-black text-slate-950">
                No orders yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
                Complete checkout and your confirmed ByteMart orders will appear
                here.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                    asChild
                    className="bg-brand-orange font-bold hover:bg-orange-600"
                >
                    <Link href="/shop">
                        <ShoppingBag /> Browse products
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/delivery">
                        <Truck /> Delivery information
                    </Link>
                </Button>
            </div>
        </section>
    );
}

function formatOrderDate(value: string) {
    return new Intl.DateTimeFormat('en-NP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

Orders.layout = {
    breadcrumbs: [
        {
            title: 'My account',
            href: dashboard(),
        },
        {
            title: 'Orders',
            href: '/orders',
        },
    ],
};
