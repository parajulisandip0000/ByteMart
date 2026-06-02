import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { StorefrontLayout } from '@/components/layout/storefront-layout';
import type { Category } from '@/types';

export default function Categories({ categories }: { categories: Category[] }) {
    return (
        <>
            <Head title="Categories" />
            <StorefrontLayout>
                <section className="bg-brand-sky/60">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                            Shop your way
                        </p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                            Browse categories
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            Explore ByteMart collections and quickly find the
                            products that fit your everyday needs.
                        </p>
                    </div>
                </section>
                <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            {category.imageUrl && (
                                <div className="h-48 w-full overflow-hidden bg-white flex items-center justify-center border-b border-slate-100">
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="h-full max-h-full w-auto max-w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between p-5">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">
                                        {category.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {category.productCount ?? 0} products
                                    </p>
                                </div>
                                <span className="rounded-full bg-brand-sky/50 p-3 text-brand-blue">
                                    <ArrowRight />
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
            </StorefrontLayout>
        </>
    );
}
