import { Head, Link, router } from '@inertiajs/react';
import { Filter, Grid2X2, List, SlidersHorizontal, Tag, X } from 'lucide-react';
import { useState } from 'react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { ProductCard } from '@/components/product/product-card';
import { SidebarProduct } from '@/components/product/sidebar-product';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import type { Category, PaginatedProducts, Product } from '@/types';

interface ShopProps {
    categories: Category[];
    products: PaginatedProducts;
    topRatedProducts: Product[];
    filters: {
        q: string;
        sort: string;
        category: string | null;
        minPrice: number;
        maxPrice: number;
        inStock: boolean;
        onSale: boolean;
    };
    filterOptions: {
        minPrice: number;
        maxPrice: number;
    };
    pageTitle: string;
    pageDescription: string;
    dealsOnly: boolean;
}

type FilterValues = Pick<
    ShopProps['filters'],
    'q' | 'sort' | 'minPrice' | 'maxPrice' | 'inStock' | 'onSale'
>;

export default function Shop({
    categories,
    products,
    topRatedProducts,
    filters,
    filterOptions,
    pageTitle,
    pageDescription,
    dealsOnly,
}: ShopProps) {
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [values, setValues] = useState<FilterValues>(filters);
    const priceRange = filterOptions.maxPrice - filterOptions.minPrice;
    const minimumPricePosition =
        priceRange > 0
            ? ((values.minPrice - filterOptions.minPrice) / priceRange) * 100
            : 0;
    const maximumPricePosition =
        priceRange > 0
            ? ((values.maxPrice - filterOptions.minPrice) / priceRange) * 100
            : 100;

    const basePath = dealsOnly
        ? '/deals'
        : filters.category
          ? `/categories/${filters.category}`
          : '/shop';

    const params = (nextValues: FilterValues = values) => ({
        q: nextValues.q || undefined,
        sort: nextValues.sort || undefined,
        min_price:
            nextValues.minPrice > filterOptions.minPrice
                ? nextValues.minPrice
                : undefined,
        max_price:
            nextValues.maxPrice < filterOptions.maxPrice
                ? nextValues.maxPrice
                : undefined,
        in_stock: nextValues.inStock ? 1 : undefined,
        on_sale: !dealsOnly && nextValues.onSale ? 1 : undefined,
    });

    const applyFilters = (nextValues: FilterValues = values) => {
        router.get(basePath, params(nextValues), {
            preserveScroll: true,
            preserveState: true,
        });
        setFilterPanelOpen(false);
    };

    const resetFilters = () => {
        const resetValues = {
            q: '',
            sort: '',
            minPrice: filterOptions.minPrice,
            maxPrice: filterOptions.maxPrice,
            inStock: false,
            onSale: dealsOnly,
        };
        setValues(resetValues);
        router.get(basePath);
    };

    return (
        <>
            <Head title={pageTitle} />
            <StorefrontLayout>
                <section className="border-b border-blue-800 bg-brand-blue text-white">
                    <div className="mx-auto max-w-[1536px] px-4 py-10 sm:px-6 lg:px-8">
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

                <section className="mx-auto max-w-[1536px] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid gap-7 lg:grid-cols-[290px_1fr]">
                        <aside
                            className={`${filterPanelOpen ? 'block' : 'hidden'} h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block`}
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <h2 className="flex items-center gap-2 font-black text-slate-900">
                                    <Filter className="size-4" /> Filter
                                    products
                                </h2>
                                <button
                                    type="button"
                                    className="text-slate-500 lg:hidden"
                                    onClick={() => setFilterPanelOpen(false)}
                                    aria-label="Close filters"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="border-b border-slate-200 py-5">
                                <h3 className="font-black text-slate-900">
                                    Filter by price
                                </h3>
                                <div className="relative mt-6 h-5">
                                    <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
                                    <div
                                        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-blue"
                                        style={{
                                            left: `${minimumPricePosition}%`,
                                            right: `${100 - maximumPricePosition}%`,
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min={filterOptions.minPrice}
                                        max={filterOptions.maxPrice}
                                        step="100"
                                        value={values.minPrice}
                                        aria-label="Minimum price"
                                        onChange={(event) =>
                                            setValues({
                                                ...values,
                                                minPrice: Math.min(
                                                    Number(event.target.value),
                                                    values.maxPrice,
                                                ),
                                            })
                                        }
                                        className="price-range-input"
                                    />
                                    <input
                                        type="range"
                                        min={filterOptions.minPrice}
                                        max={filterOptions.maxPrice}
                                        step="100"
                                        value={values.maxPrice}
                                        aria-label="Maximum price"
                                        onChange={(event) =>
                                            setValues({
                                                ...values,
                                                maxPrice: Math.max(
                                                    Number(event.target.value),
                                                    values.minPrice,
                                                ),
                                            })
                                        }
                                        className="price-range-input"
                                    />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm font-bold text-brand-blue">
                                    <span>{formatNpr(values.minPrice)}</span>
                                    <span>{formatNpr(values.maxPrice)}</span>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="mt-4 w-full bg-brand-blue"
                                    onClick={() => applyFilters()}
                                >
                                    Filter price
                                </Button>
                            </div>

                            <div className="border-b border-slate-200 py-5">
                                <h3 className="font-black text-slate-900">
                                    Product categories
                                </h3>
                                <div className="mt-3 grid gap-2 text-sm">
                                    <Link
                                        href={dealsOnly ? '/deals' : '/shop'}
                                        className={`flex justify-between gap-3 ${!filters.category ? 'font-bold text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}
                                    >
                                        <span>All products</span>
                                        <span>{products.total}</span>
                                    </Link>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/categories/${category.slug}`}
                                            className={`flex justify-between gap-3 ${filters.category === category.slug ? 'font-bold text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}
                                        >
                                            <span>{category.name}</span>
                                            <span>{category.productCount}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-b border-slate-200 py-5">
                                <h3 className="font-black text-slate-900">
                                    Top rated products
                                </h3>
                                <div className="mt-4 grid gap-4">
                                    {topRatedProducts.map((product) => (
                                        <SidebarProduct
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-5">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-sm font-bold text-brand-orange hover:text-orange-700"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </aside>

                        <div>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="lg:hidden"
                                        onClick={() =>
                                            setFilterPanelOpen((open) => !open)
                                        }
                                    >
                                        <Filter /> Filters
                                    </Button>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={values.inStock}
                                            onChange={(event) => {
                                                const nextValues = {
                                                    ...values,
                                                    inStock:
                                                        event.target.checked,
                                                };
                                                setValues(nextValues);
                                                applyFilters(nextValues);
                                            }}
                                            className="size-4 accent-brand-blue"
                                        />
                                        In stock
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={values.onSale}
                                            disabled={dealsOnly}
                                            onChange={(event) => {
                                                const nextValues = {
                                                    ...values,
                                                    onSale: event.target
                                                        .checked,
                                                };
                                                setValues(nextValues);
                                                applyFilters(nextValues);
                                            }}
                                            className="size-4 accent-brand-blue"
                                        />
                                        On sale
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <SlidersHorizontal className="size-4" />
                                        <select
                                            value={values.sort}
                                            onChange={(event) => {
                                                const nextValues = {
                                                    ...values,
                                                    sort: event.target.value,
                                                };
                                                setValues(nextValues);
                                                applyFilters(nextValues);
                                            }}
                                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 outline-none"
                                        >
                                            <option value="">Newest</option>
                                            <option value="price-low">
                                                Price: low to high
                                            </option>
                                            <option value="price-high">
                                                Price: high to low
                                            </option>
                                        </select>
                                    </label>
                                    <button
                                        type="button"
                                        aria-label="Grid view"
                                        onClick={() => setView('grid')}
                                        className={`rounded-lg p-2 ${view === 'grid' ? 'bg-brand-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        <Grid2X2 className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="List view"
                                        onClick={() => setView('list')}
                                        className={`rounded-lg p-2 ${view === 'list' ? 'bg-brand-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        <List className="size-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
                                <p>
                                    Showing {products.from ?? 0}-
                                    {products.to ?? 0} of {products.total}{' '}
                                    products
                                </p>
                                {dealsOnly && (
                                    <p className="flex items-center gap-1 font-bold text-brand-orange">
                                        <Tag className="size-4" /> Weekend
                                        offers
                                    </p>
                                )}
                            </div>

                            {products.data.length > 0 ? (
                                <div
                                    className={
                                        view === 'grid'
                                            ? 'grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4'
                                            : 'grid gap-4'
                                    }
                                >
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            view={view}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-white px-6 py-16 text-center text-slate-500">
                                    No products match your selected filters.
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
                                                    .replace(
                                                        '&laquo; Previous',
                                                        'Previous',
                                                    )
                                                    .replace(
                                                        'Next &raquo;',
                                                        'Next',
                                                    )}
                                            </Link>
                                        ) : (
                                            <span
                                                key={`${link.label}-${index}`}
                                                className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-400"
                                            >
                                                {link.label
                                                    .replace(
                                                        '&laquo; Previous',
                                                        'Previous',
                                                    )
                                                    .replace(
                                                        'Next &raquo;',
                                                        'Next',
                                                    )}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </StorefrontLayout>
        </>
    );
}
