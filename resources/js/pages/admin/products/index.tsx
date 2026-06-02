import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';

interface ProductRow {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    categories: string[];
    price: string | null;
    stockQuantity: number;
    isActive: boolean;
    imageUrl: string | null;
}

interface Products {
    data: ProductRow[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function ProductsIndex({
    products,
    filters,
}: {
    products: Products;
    filters: { search: string };
}) {
    const search = useForm({ search: filters.search });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/products', { preserveState: true });
    };

    return (
        <>
            <Head title="Manage products" />
            <AdminPageHeader
                eyebrow="Catalog"
                title="Products"
                description="Create products, upload storefront images, set pricing, and monitor available stock."
                actions={
                    <Button asChild className="bg-brand-orange font-bold">
                        <Link href="/admin/products/create">
                            <Plus /> Add product
                        </Link>
                    </Button>
                }
            />
            <form
                onSubmit={submit}
                className="mt-6 flex max-w-xl gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
                <Search className="mt-2 size-5 text-slate-400" />
                <input
                    value={search.data.search}
                    onChange={(event) =>
                        search.setData('search', event.target.value)
                    }
                    placeholder="Search products"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-4xl text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Categories</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.data.map((product) => (
                            <tr key={product.id}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.imageUrl ?? ''}
                                            alt=""
                                            className="size-12 rounded-lg bg-slate-100 object-cover"
                                        />
                                        <div>
                                            <p className="font-black">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {product.brand ?? 'No brand'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500">
                                    {product.categories.join(', ')}
                                </td>
                                <td className="px-4 py-3 font-bold text-brand-blue">
                                    {product.price
                                        ? formatNpr(product.price)
                                        : 'Not set'}
                                </td>
                                <td className="px-4 py-3">
                                    {product.stockQuantity}
                                </td>
                                <td className="px-4 py-3">
                                    <Status active={product.isActive} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            asChild
                                            size="icon"
                                            variant="outline"
                                            aria-label={`Edit ${product.name}`}
                                        >
                                            <Link
                                                href={`/admin/products/${product.slug}/edit`}
                                            >
                                                <Edit3 />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            aria-label={`Delete ${product.name}`}
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `Delete ${product.name}?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/admin/products/${product.slug}`,
                                                    );
                                                }
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={products.links} />
        </>
    );
}

function Status({ active }: { active: boolean }) {
    return (
        <span
            className={`rounded-full px-2 py-1 text-xs font-black ${
                active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
            }`}
        >
            {active ? 'Active' : 'Hidden'}
        </span>
    );
}
