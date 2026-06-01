import { Head, Link, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';
import { useState } from 'react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { ProductCard } from '@/components/product/product-card';
import type { Category, PaginatedProducts } from '@/types';

interface ShopProps {
    categories: Category[];
    products: PaginatedProducts;
    filters: {
        q: string;
        sort: string;
        category: string | null;
    };
    pageTitle: string;
    pageDescription: string;
    dealsOnly: boolean;
}

export default function Shop({
    categories,
    products,
    filters,
    pageTitle,
    pageDescription,
    dealsOnly,
}: ShopProps) {
    const [query, setQuery] = useState(filters.q);

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            dealsOnly
                ? '/deals'
                : filters.category
                  ? `/categories/${filters.category}`
                  : '/shop',
            { q: query, sort: filters.sort },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title={pageTitle} />
            <StorefrontLayout>
                <section className="bg-brand-blue text-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-yellow uppercase">
                            {dealsOnly
                                ? 'Limited-time savings'
                                : 'ByteMart collection'}
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight">
                            {pageTitle}
                        </h1>
                        <p className="mt-3 max-w-2xl text-blue-100">
                            {pageDescription}
                        </p>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-7 flex flex-wrap gap-2">
                        <Link
                            href={dealsOnly ? '/deals' : '/shop'}
                            className={`rounded-full px-4 py-2 text-sm font-bold ${!filters.category ? 'bg-brand-blue text-white' : 'bg-white text-slate-700 hover:text-brand-blue'}`}
                        >
                            {dealsOnly ? 'All deals' : 'All products'}
                        </Link>
                        {!dealsOnly &&
                            categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className={`rounded-full px-4 py-2 text-sm font-bold ${filters.category === category.slug ? 'bg-brand-blue text-white' : 'bg-white text-slate-700 hover:text-brand-blue'}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                    </div>
                    <div className="mb-7 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
                        <form onSubmit={submitSearch} className="relative">
                            <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-brand-cyan"
                                placeholder="Search products"
                                aria-label="Search products"
                            />
                        </form>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <SlidersHorizontal className="size-4" />
                            <select
                                value={filters.sort}
                                onChange={(event) =>
                                    router.get(
                                        dealsOnly
                                            ? '/deals'
                                            : filters.category
                                              ? `/categories/${filters.category}`
                                              : '/shop',
                                        { q: query, sort: event.target.value },
                                        { preserveState: true },
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none"
                            >
                                <option value="">Newest first</option>
                                <option value="price-low">
                                    Price: low to high
                                </option>
                                <option value="price-high">
                                    Price: high to low
                                </option>
                            </select>
                        </label>
                    </div>
                    <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
                        <p>{products.total} products found</p>
                        {dealsOnly && (
                            <p className="flex items-center gap-1 font-bold text-brand-orange">
                                <Tag className="size-4" /> Weekend offers
                            </p>
                        )}
                    </div>
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white px-6 py-16 text-center text-slate-500">
                            No products match your search.
                        </div>
                    )}
                    {products.links.length > 3 && (
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {products.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url}
                                        className={`rounded-lg px-3 py-2 text-sm font-bold ${link.active ? 'bg-brand-blue text-white' : 'bg-white text-slate-600 hover:text-brand-blue'}`}
                                    >
                                        {link.label
                                            .replace('&laquo;', '‹')
                                            .replace('&raquo;', '›')}
                                    </Link>
                                ) : (
                                    <span
                                        key={`${link.label}-${index}`}
                                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-400"
                                    >
                                        {link.label
                                            .replace('&laquo;', '‹')
                                            .replace('&raquo;', '›')}
                                    </span>
                                ),
                            )}
                        </div>
                    )}
                </section>
            </StorefrontLayout>
        </>
    );
}
