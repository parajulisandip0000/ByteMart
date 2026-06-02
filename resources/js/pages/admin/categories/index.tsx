import { Head, router, useForm } from '@inertiajs/react';
import { ImageUp, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent: string | null;
    parentId: number | null;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    productsCount: number;
}

export default function CategoriesIndex({
    categories,
    filters,
}: {
    categories: Category[];
    filters: { search: string };
}) {
    const [editing, setEditing] = useState<Category | null>(null);
    const searchForm = useForm({ search: filters?.search ?? '' });
    const form = useForm({
        name: '',
        slug: '',
        parent_id: '',
        sort_order: 0,
        is_active: true,
        image: null as File | null,
    });

    const beginEdit = (category: Category) => {
        setEditing(category);
        form.setData({
            name: category.name,
            slug: category.slug,
            parent_id: category.parentId?.toString() ?? '',
            sort_order: category.sortOrder,
            is_active: category.isActive,
            image: null,
        });
    };

    const reset = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: reset,
        };

        form.transform((data) =>
            editing ? { ...data, _method: 'patch' } : data,
        );
        form.post(
            editing ? `/admin/categories/${editing.slug}` : '/admin/categories',
            options,
        );
    };

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        searchForm.get('/admin/categories', { preserveState: true });
    };

    return (
        <>
            <Head title="Manage categories" />
            <AdminPageHeader
                eyebrow="Catalog"
                title="Categories"
                description="Maintain category navigation, storefront imagery, visibility, and display order."
            />
            <form
                onSubmit={submitSearch}
                className="mt-6 flex max-w-xl gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
                <Search className="mt-2 size-5 text-slate-400" />
                <input
                    value={searchForm.data.search}
                    onChange={(event) =>
                        searchForm.setData('search', event.target.value)
                    }
                    placeholder="Search categories"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>
            <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
                <form
                    onSubmit={submit}
                    className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-black">
                            {editing ? 'Edit category' : 'Add category'}
                        </h2>
                        {editing && (
                            <button
                                type="button"
                                onClick={reset}
                                aria-label="Cancel editing"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                    <CategoryField
                        label="Name"
                        value={form.data.name}
                        error={form.errors.name}
                        onChange={(value) => form.setData('name', value)}
                    />
                    <CategoryField
                        label="Slug"
                        value={form.data.slug}
                        error={form.errors.slug}
                        placeholder="Generated when blank"
                        onChange={(value) => form.setData('slug', value)}
                    />
                    <label className="mt-4 block text-sm font-bold">
                        Parent category
                        <select
                            value={form.data.parent_id}
                            onChange={(event) =>
                                form.setData('parent_id', event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
                        >
                            <option value="">None</option>
                            {categories
                                .filter(
                                    (category) => category.id !== editing?.id,
                                )
                                .map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                    <CategoryField
                        label="Sort order"
                        type="number"
                        value={form.data.sort_order.toString()}
                        error={form.errors.sort_order}
                        onChange={(value) =>
                            form.setData('sort_order', Number(value))
                        }
                    />
                    <div className="mt-4">
                        <p className="text-sm font-bold">Category image</p>
                        <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand-cyan bg-brand-sky/20 p-3 transition hover:bg-brand-sky/40">
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-brand-blue shadow-sm">
                                <ImageUp className="size-5" />
                            </span>
                            <span className="min-w-0">
                                <strong className="block text-sm text-brand-blue">
                                    {form.data.image
                                        ? 'Change selected image'
                                        : 'Choose category image'}
                                </strong>
                                <span className="mt-0.5 block truncate text-xs font-normal text-slate-500">
                                    {form.data.image?.name ??
                                        (editing?.imageUrl
                                            ? 'Current image will stay unless you select a replacement.'
                                            : 'PNG, JPG or WEBP up to 4 MB.')}
                                </span>
                            </span>
                            <span className="sr-only">
                                Browse files from your computer
                            </span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(event) =>
                                    form.setData(
                                        'image',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                className="sr-only"
                            />
                        </label>
                        {form.errors.image && (
                            <span className="mt-1 block text-xs text-red-600">
                                {form.errors.image}
                            </span>
                        )}
                        {editing?.imageUrl && !form.data.image && (
                            <img
                                src={editing.imageUrl}
                                alt={`${editing.name} current category`}
                                className="mt-3 size-16 rounded-lg border border-slate-200 object-cover"
                            />
                        )}
                    </div>
                    <label className="mt-4 flex gap-2 text-sm font-bold">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) =>
                                form.setData('is_active', event.target.checked)
                            }
                        />
                        Visible in storefront
                    </label>
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="mt-5 bg-brand-orange font-bold"
                    >
                        <Plus /> {editing ? 'Update category' : 'Add category'}
                    </Button>
                </form>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full min-w-3xl text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Parent</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-4 py-3 font-black">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {category.parent ?? 'Top level'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.productsCount}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.isActive
                                            ? 'Active'
                                            : 'Hidden'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() =>
                                                    beginEdit(category)
                                                }
                                                aria-label={`Edit ${category.name}`}
                                            >
                                                <Pencil />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                disabled={
                                                    category.productsCount > 0
                                                }
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            `Delete ${category.name}?`,
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/admin/categories/${category.slug}`,
                                                        );
                                                    }
                                                }}
                                                aria-label={`Delete ${category.name}`}
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
            </div>
        </>
    );
}

function CategoryField({
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
        <label className="mt-4 block text-sm font-bold">
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal"
            />
            {error && (
                <span className="mt-1 block text-xs text-red-600">{error}</span>
            )}
        </label>
    );
}
