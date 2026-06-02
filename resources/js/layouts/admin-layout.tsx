import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Boxes,
    FolderTree,
    LayoutDashboard,
    LogOut,
    MessageSquareText,
    PackageCheck,
    ShoppingBag,
    Store,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const navigation = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Boxes },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: PackageCheck },
    { label: 'Customers', href: '/admin/users', icon: Users },
    { label: 'Reviews', href: '/admin/reviews', icon: MessageSquareText },
    { label: 'Activity logs', href: '/admin/logs', icon: Activity },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { url, props } = usePage();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <aside className="bg-slate-950 px-4 py-5 text-white">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-2"
                    >
                        <span className="grid size-10 place-items-center rounded-xl bg-brand-orange">
                            <ShoppingBag className="size-5" />
                        </span>
                        <span>
                            <strong className="block text-lg">ByteMart</strong>
                            <small className="text-slate-400">
                                Admin portal
                            </small>
                        </span>
                    </Link>
                    <nav className="mt-8 grid gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white',
                                    isActive(url, item.href) &&
                                        'bg-brand-blue text-white',
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8 border-t border-white/10 pt-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                            <Store className="size-4" /> View storefront
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                            <LogOut className="size-4" /> Log out
                        </Link>
                    </div>
                </aside>
                <main>
                    <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
                        <p className="text-sm text-slate-500">
                            Signed in as{' '}
                            <strong className="text-slate-900">
                                {props.auth.user.name}
                            </strong>
                        </p>
                    </header>
                    <div className="p-5 sm:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}

function isActive(url: string, href: string) {
    return href === '/admin' ? url === href : url.startsWith(href);
}
