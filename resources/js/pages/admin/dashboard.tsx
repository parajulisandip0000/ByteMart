import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Boxes,
    FolderTree,
    MessageSquareText,
    PackageCheck,
    PackageSearch,
    Users,
} from 'lucide-react';

import { AdminPageHeader } from '@/components/admin/page-header';

interface Metrics {
    products: number;
    categories: number;
    customers: number;
    lowStock: number;
    reviews: number;
    orders: number;
}

interface Log {
    id: number;
    action: string;
    description: string;
    user: string;
    createdAt: string;
}

export default function AdminDashboard({
    metrics,
    recentLogs,
}: {
    metrics: Metrics;
    recentLogs: Log[];
}) {
    const cards = [
        ['Products', metrics.products, Boxes, '/admin/products'],
        ['Categories', metrics.categories, FolderTree, '/admin/categories'],
        ['Customers', metrics.customers, Users, '/admin/users'],
        ['Orders', metrics.orders, PackageCheck, '/admin/orders'],
        ['Low stock items', metrics.lowStock, PackageSearch, '/admin/products'],
        [
            'Product reviews',
            metrics.reviews,
            MessageSquareText,
            '/admin/reviews',
        ],
    ] as const;

    return (
        <>
            <Head title="Admin dashboard" />
            <AdminPageHeader
                eyebrow="Administration"
                title="Store overview"
                description="Manage ByteMart catalog data, customer access, operational reviews, and audit history."
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {cards.map(([label, value, Icon, href]) => (
                    <Link
                        key={label}
                        href={href}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Icon className="size-5 text-brand-blue" />
                        <p className="mt-5 text-3xl font-black">{value}</p>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                            {label}
                        </p>
                    </Link>
                ))}
            </div>
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-lg font-black">
                        <Activity className="size-5 text-brand-orange" /> Recent
                        activity
                    </h2>
                    <Link
                        href="/admin/logs"
                        className="text-sm font-bold text-brand-blue hover:text-brand-orange"
                    >
                        View all logs
                    </Link>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                    {recentLogs.length > 0 ? (
                        recentLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-bold text-slate-800">
                                        {log.description}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {log.user} · {log.action}
                                    </p>
                                </div>
                                <time className="text-xs text-slate-400">
                                    {log.createdAt}
                                </time>
                            </div>
                        ))
                    ) : (
                        <p className="py-8 text-sm text-slate-500">
                            Admin actions will appear here as changes are made.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
