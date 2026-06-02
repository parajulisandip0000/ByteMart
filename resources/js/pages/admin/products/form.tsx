import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

interface Option {
    id: number;
    name: string;
}

interface ProductFormProduct {
    id: number;
    name: string;
    slug: string;
    brandId: number | null;
    categoryIds: number[];
    shortDescription: string;
    description: string;
    isActive: boolean;
    isFeatured: boolean;
    sku: string;
    price: string;
    compareAtPrice: string;
    stockQuantity: number;
    imageUrl: string | null;
}

export default function ProductForm({
    product,
    brands,
    categories,
}: {
    product: ProductFormProduct | null;
    brands: Option[];
    categories: Option[];
}) {
    const form = useForm({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        brand_id: product?.brandId?.toString() ?? '',
        category_ids: product?.categoryIds ?? ([] as number[]),
        short_description: product?.shortDescription ?? '',
        description: product?.description ?? '',
        sku: product?.sku ?? '',
        price: product?.price ?? '',
        compare_at_price: product?.compareAtPrice ?? '',
        stock_quantity: product?.stockQuantity ?? 0,
        is_active: product?.isActive ?? true,
        is_featured: product?.isFeatured ?? false,
        image: null as File | null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (product) {
            form.transform((data) => ({ ...data, _method: 'patch' }));
            form.post(`/admin/products/${product.slug}`, {
                forceFormData: true,
            });
        } else {
            form.post('/admin/products', { forceFormData: true });
        }
    };

    return (
        <>
            <Head title={product ? 'Edit product' : 'Add product'} />
            <AdminPageHeader
                eyebrow="Catalog"
                title={product ? 'Edit product' : 'Add product'}
                description="Maintain the storefront content, pricing, inventory, classification, and primary image."
            />
            <form
                onSubmit={submit}
                className="mt-6 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2"
            >
                <Field
                    label="Product name"
                    value={form.data.name}
                    error={form.errors.name}
                    onChange={(value) => form.setData('name', value)}
                />
                <Field
                    label="Slug"
                    value={form.data.slug}
                    error={form.errors.slug}
                    onChange={(value) => form.setData('slug', value)}
                    placeholder="Generated from name when blank"
                />
                <label className="text-sm font-bold text-slate-700">
                    Brand
                    <select
                        value={form.data.brand_id}
                        onChange={(event) =>
                            form.setData('brand_id', event.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
                    >
                        <option value="">No brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </label>
                <Field
                    label="SKU"
                    value={form.data.sku}
                    error={form.errors.sku}
                    onChange={(value) => form.setData('sku', value)}
                />
                <Field
                    label="Price (NPR)"
                    type="number"
                    value={form.data.price}
                    error={form.errors.price}
                    onChange={(value) => form.setData('price', value)}
                />
                <Field
                    label="Compare at price (NPR)"
                    type="number"
                    value={form.data.compare_at_price}
                    error={form.errors.compare_at_price}
                    onChange={(value) =>
                        form.setData('compare_at_price', value)
                    }
                />
                <Field
                    label="Stock quantity"
                    type="number"
                    value={form.data.stock_quantity.toString()}
                    error={form.errors.stock_quantity}
                    onChange={(value) =>
                        form.setData('stock_quantity', Number(value))
                    }
                />
                <label className="text-sm font-bold text-slate-700">
                    Primary image {product ? '(optional replacement)' : ''}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            form.setData(
                                'image',
                                event.target.files?.[0] ?? null,
                            )
                        }
                        className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"
                    />
                    <Error message={form.errors.image} />
                </label>
                <label className="text-sm font-bold text-slate-700 lg:col-span-2">
                    Categories
                    <span className="mt-2 grid gap-2 sm:grid-cols-3">
                        {categories.map((category) => (
                            <span
                                key={category.id}
                                className="flex gap-2 rounded-xl border border-slate-200 p-3 font-normal"
                            >
                                <input
                                    type="checkbox"
                                    checked={form.data.category_ids.includes(
                                        category.id,
                                    )}
                                    onChange={(event) =>
                                        form.setData(
                                            'category_ids',
                                            event.target.checked
                                                ? [
                                                      ...form.data.category_ids,
                                                      category.id,
                                                  ]
                                                : form.data.category_ids.filter(
                                                      (id) =>
                                                          id !== category.id,
                                                  ),
                                        )
                                    }
                                />
                                {category.name}
                            </span>
                        ))}
                    </span>
                    <Error message={form.errors.category_ids} />
                </label>
                <Textarea
                    label="Short description"
                    value={form.data.short_description}
                    error={form.errors.short_description}
                    onChange={(value) =>
                        form.setData('short_description', value)
                    }
                />
                <Textarea
                    label="Full description"
                    value={form.data.description}
                    error={form.errors.description}
                    onChange={(value) => form.setData('description', value)}
                />
                <label className="flex items-center gap-2 text-sm font-bold">
                    <input
                        type="checkbox"
                        checked={form.data.is_active}
                        onChange={(event) =>
                            form.setData('is_active', event.target.checked)
                        }
                    />
                    Visible in storefront
                </label>
                <label className="flex items-center gap-2 text-sm font-bold">
                    <input
                        type="checkbox"
                        checked={form.data.is_featured}
                        onChange={(event) =>
                            form.setData('is_featured', event.target.checked)
                        }
                    />
                    Featured product
                </label>
                <div className="flex gap-3 lg:col-span-2">
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="bg-brand-orange font-bold"
                    >
                        {product ? 'Update product' : 'Create product'}
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/products">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

function Field({
    label,
    value,
    error,
    onChange,
    type = 'text',
    placeholder,
}: {
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <label className="text-sm font-bold text-slate-700">
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
            />
            <Error message={error} />
        </label>
    );
}

function Textarea({
    label,
    value,
    error,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="text-sm font-bold text-slate-700">
            {label}
            <textarea
                rows={5}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
            />
            <Error message={error} />
        </label>
    );
}

function Error({ message }: { message?: string }) {
    return message ? (
        <span className="mt-1 block text-xs text-red-600">{message}</span>
    ) : null;
}
