import { Head, Link } from '@inertiajs/react';
import {
    Boxes,
    FolderTree,
    MessageSquareText,
    PackageCheck,
    PackageSearch,
    Users,
    Heart,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    LineChart,
    Award,
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

interface ProductMetric {
    name: string;
    slug: string;
    category: string;
    imageUrl: string | null;
    count: number;
}

interface Analytics {
    topWishlist: ProductMetric | null;
    topCart: ProductMetric | null;
    mostPurchased: ProductMetric | null;
    leastPurchased: ProductMetric | null;
    totalRevenue: number;
    averageOrderValue: number;
    totalWishlists: number;
    totalCarts: number;
}

export default function AdminDashboard({
    metrics,
    analytics,
}: {
    metrics: Metrics;
    analytics: Analytics;
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

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <Head title="Admin dashboard" />
            <AdminPageHeader
                eyebrow="Administration"
                title="Store overview"
                description="Manage ByteMart catalog data, customer access, operational reviews, and track performance analytics."
            />

            {/* Top Stat Cards */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {cards.map(([label, value, Icon, href]) => (
                    <Link
                        key={label}
                        href={href}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <Icon className="size-5 text-brand-blue transition-transform duration-300 group-hover:scale-110" />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <p className="mt-5 text-3xl font-black text-slate-800">{value}</p>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                            {label}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="mt-7 grid gap-6 lg:grid-cols-3">
                {/* Column 1 & 2: Product Performance */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-800">
                                <Award className="size-5 text-brand-orange" /> Product Performance Insights
                            </h2>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-blue">
                                Live Database Stats
                            </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {/* Top Wishlist Product */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-pink-50 px-2 py-0.5 text-xs font-bold text-pink-600">
                                            <Heart className="size-3 fill-current" /> Top Wishlist
                                        </span>
                                        {analytics.topWishlist ? (
                                            <>
                                                <h3 className="mt-2.5 truncate font-extrabold text-slate-800">
                                                    {analytics.topWishlist.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                    {analytics.topWishlist.category}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-sm text-slate-400">No data available</p>
                                        )}
                                    </div>
                                    {analytics.topWishlist?.imageUrl && (
                                        <img
                                            src={analytics.topWishlist.imageUrl}
                                            alt={analytics.topWishlist.name}
                                            className="size-14 rounded-lg bg-white object-cover border border-slate-100 shadow-sm shrink-0"
                                        />
                                    )}
                                </div>
                                {analytics.topWishlist && (
                                    <div className="mt-4 flex items-baseline gap-1 border-t border-slate-100/80 pt-3">
                                        <span className="text-2xl font-black text-pink-600">{analytics.topWishlist.count}</span>
                                        <span className="text-xs font-bold text-slate-500">wishlist additions</span>
                                    </div>
                                )}
                            </div>

                            {/* Top Cart Product */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-blue">
                                            <ShoppingCart className="size-3 fill-current" /> Top Added to Cart
                                        </span>
                                        {analytics.topCart ? (
                                            <>
                                                <h3 className="mt-2.5 truncate font-extrabold text-slate-800">
                                                    {analytics.topCart.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                    {analytics.topCart.category}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-sm text-slate-400">No data available</p>
                                        )}
                                    </div>
                                    {analytics.topCart?.imageUrl && (
                                        <img
                                            src={analytics.topCart.imageUrl}
                                            alt={analytics.topCart.name}
                                            className="size-14 rounded-lg bg-white object-cover border border-slate-100 shadow-sm shrink-0"
                                        />
                                    )}
                                </div>
                                {analytics.topCart && (
                                    <div className="mt-4 flex items-baseline gap-1 border-t border-slate-100/80 pt-3">
                                        <span className="text-2xl font-black text-brand-blue">{analytics.topCart.count}</span>
                                        <span className="text-xs font-bold text-slate-500">units in carts</span>
                                    </div>
                                )}
                            </div>

                            {/* Most Purchased Product */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
                                            <TrendingUp className="size-3" /> Most Purchased
                                        </span>
                                        {analytics.mostPurchased ? (
                                            <>
                                                <h3 className="mt-2.5 truncate font-extrabold text-slate-800">
                                                    {analytics.mostPurchased.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                    {analytics.mostPurchased.category}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-sm text-slate-400">No sales yet</p>
                                        )}
                                    </div>
                                    {analytics.mostPurchased?.imageUrl && (
                                        <img
                                            src={analytics.mostPurchased.imageUrl}
                                            alt={analytics.mostPurchased.name}
                                            className="size-14 rounded-lg bg-white object-cover border border-slate-100 shadow-sm shrink-0"
                                        />
                                    )}
                                </div>
                                {analytics.mostPurchased && (
                                    <div className="mt-4 flex items-baseline gap-1 border-t border-slate-100/80 pt-3">
                                        <span className="text-2xl font-black text-emerald-600">{analytics.mostPurchased.count}</span>
                                        <span className="text-xs font-bold text-slate-500">units sold</span>
                                    </div>
                                )}
                            </div>

                            {/* Least Purchased Product */}
                            <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-bold text-brand-orange">
                                            <TrendingDown className="size-3" /> Least Purchased
                                        </span>
                                        {analytics.leastPurchased ? (
                                            <>
                                                <h3 className="mt-2.5 truncate font-extrabold text-slate-800">
                                                    {analytics.leastPurchased.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                    {analytics.leastPurchased.category}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="mt-3 text-sm text-slate-400">No data available</p>
                                        )}
                                    </div>
                                    {analytics.leastPurchased?.imageUrl && (
                                        <img
                                            src={analytics.leastPurchased.imageUrl}
                                            alt={analytics.leastPurchased.name}
                                            className="size-14 rounded-lg bg-white object-cover border border-slate-100 shadow-sm shrink-0"
                                        />
                                    )}
                                </div>
                                {analytics.leastPurchased !== null && (
                                    <div className="mt-4 flex items-baseline gap-1 border-t border-slate-100/80 pt-3">
                                        <span className="text-2xl font-black text-brand-orange">{analytics.leastPurchased.count}</span>
                                        <span className="text-xs font-bold text-slate-500">units sold</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Column 3: Store Statistics & Sales Performance */}
                <div>
                    <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-800">
                                    <LineChart className="size-5 text-brand-blue" /> Financials & Engagement
                                </h2>
                            </div>

                            <div className="mt-6 space-y-4">
                                {/* Revenue Indicator */}
                                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-sky-50/50 p-4 border border-blue-100/50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <DollarSign className="size-3.5 text-brand-blue" /> Total Store Revenue
                                    </div>
                                    <p className="mt-1 text-2xl font-black text-brand-blue">
                                        {formatPrice(analytics.totalRevenue)}
                                    </p>
                                </div>

                                {/* AOV Indicator */}
                                <div className="rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/20 p-4 border border-emerald-100/40">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <TrendingUp className="size-3.5 text-emerald-600" /> Average Order Value
                                    </div>
                                    <p className="mt-1 text-2xl font-black text-emerald-600">
                                        {formatPrice(analytics.averageOrderValue)}
                                    </p>
                                </div>

                                {/* Wishlist & Cart additions aggregates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-3.5">
                                        <span className="block text-xs font-bold text-slate-400">Total Wishlists</span>
                                        <span className="mt-1 block text-xl font-extrabold text-pink-600">
                                            {analytics.totalWishlists}
                                        </span>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-3.5">
                                        <span className="block text-xs font-bold text-slate-400">Total Carts</span>
                                        <span className="mt-1 block text-xl font-extrabold text-brand-blue">
                                            {analytics.totalCarts}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extra branding details to feel premium */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>ByteMart Business Engine</span>
                            <span className="flex items-center gap-1 text-emerald-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Operational
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
