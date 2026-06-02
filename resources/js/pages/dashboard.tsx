import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Heart,
    PackageCheck,
    Settings,
    ShoppingBag,
    Store,
    Truck,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import { useCart, useOrders, useWishlist } from '@/lib/storefront-storage';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props;
    const cart = useCart();
    const wishlist = useWishlist();
    const orders = useOrders();

    return (
        <>
            <Head title="My account" />
            <div className="flex flex-1 flex-col gap-7 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                <section className="overflow-hidden rounded-3xl bg-brand-blue px-6 py-7 text-white sm:px-8 sm:py-9">
                    <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                        ByteMart account
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome back, {auth.user.name}.
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                        Manage your shopping activity and continue exploring
                        ByteMart from one organized account page.
                    </p>
                    <Button
                        asChild
                        className="mt-6 bg-brand-orange font-bold hover:bg-orange-600"
                    >
                        <Link href="/shop">
                            Continue shopping <ArrowRight />
                        </Link>
                    </Button>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardStat
                        icon={<ShoppingBag />}
                        label="Cart items"
                        value={cart.itemCount.toString()}
                        href="/cart"
                        linkLabel="View cart"
                    />
                    <DashboardStat
                        icon={<Heart />}
                        label="Saved products"
                        value={wishlist.itemCount.toString()}
                        href="/wishlist"
                        linkLabel="View wishlist"
                    />
                    <DashboardStat
                        icon={<PackageCheck />}
                        label="Orders"
                        value={orders.itemCount.toString()}
                        href="/orders"
                        linkLabel="View orders"
                    />
                    <DashboardStat
                        icon={<Truck />}
                        label="Delivery"
                        value="Nepal"
                        helper="Reliable nationwide delivery"
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                                    Ready when you are
                                </p>
                                <h2 className="mt-2 text-2xl font-black text-slate-950">
                                    Your shopping cart
                                </h2>
                            </div>
                            {cart.items.length > 0 && (
                                <Link
                                    href="/cart"
                                    className="text-sm font-bold text-brand-blue hover:text-brand-orange"
                                >
                                    Open cart
                                </Link>
                            )}
                        </div>
                        {cart.items.length > 0 ? (
                            <>
                                <div className="mt-5 grid gap-3">
                                    {cart.items.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3"
                                        >
                                            <img
                                                src={item.imageUrl ?? ''}
                                                alt={item.name}
                                                className="size-16 rounded-xl bg-slate-100 object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                    className="line-clamp-1 font-bold text-slate-900 hover:text-brand-blue"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-1 text-sm text-slate-500">
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
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                                    <p>
                                        <span className="text-sm text-slate-500">
                                            Cart subtotal
                                        </span>
                                        <strong className="ml-3 text-lg text-brand-blue">
                                            {formatNpr(cart.subtotal)}
                                        </strong>
                                    </p>
                                    <Button
                                        asChild
                                        className="bg-brand-orange font-bold"
                                    >
                                        <Link href="/checkout">Checkout</Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <EmptyPanel
                                icon={<ShoppingBag />}
                                title="Your cart is empty"
                                description="Browse the shop and add products to prepare your next ByteMart order."
                                href="/shop"
                                linkLabel="Browse products"
                            />
                        )}
                    </div>
                    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                            Quick access
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-slate-950">
                            My account
                        </h2>
                        <div className="mt-5 grid gap-2">
                            <QuickLink
                                icon={<Store />}
                                title="Browse the shop"
                                href="/shop"
                            />
                            <QuickLink
                                icon={<Heart />}
                                title="View wishlist"
                                href="/wishlist"
                            />
                            <QuickLink
                                icon={<PackageCheck />}
                                title="View orders"
                                href="/orders"
                            />
                            <QuickLink
                                icon={<Settings />}
                                title="Profile settings"
                                href="/settings/profile"
                            />
                        </div>
                    </aside>
                </section>
            </div>
        </>
    );
}

function DashboardStat({
    icon,
    label,
    value,
    href,
    linkLabel,
    helper,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
    linkLabel?: string;
    helper?: string;
}) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="grid size-10 place-items-center rounded-full bg-brand-sky/50 text-brand-blue [&_svg]:size-5">
                {icon}
            </span>
            <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
            {href && linkLabel ? (
                <Link
                    href={href}
                    className="mt-3 inline-flex text-sm font-bold text-brand-blue hover:text-brand-orange"
                >
                    {linkLabel}
                </Link>
            ) : (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                    {helper}
                </p>
            )}
        </article>
    );
}

function QuickLink({
    icon,
    title,
    href,
}: {
    icon: ReactNode;
    title: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-brand-sky/30 hover:text-brand-blue"
        >
            <span className="text-brand-blue [&_svg]:size-5">{icon}</span>
            {title}
            <ArrowRight className="ml-auto size-4" />
        </Link>
    );
}

function EmptyPanel({
    icon,
    title,
    description,
    href,
    linkLabel,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
}) {
    return (
        <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-sky/50 text-brand-blue [&_svg]:size-6">
                {icon}
            </span>
            <h3 className="mt-4 font-black text-slate-900">{title}</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                {description}
            </p>
            <Link
                href={href}
                className="mt-4 inline-flex text-sm font-bold text-brand-blue hover:text-brand-orange"
            >
                {linkLabel}
            </Link>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'My account',
            href: dashboard(),
        },
    ],
};
