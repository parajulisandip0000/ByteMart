import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Upload, Plus, Trash2 } from 'lucide-react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    gallery?: { id: number; url: string }[];
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
        brand_name: '',
        category_ids: product?.categoryIds ?? ([] as number[]),
        short_description: product?.shortDescription ?? '',
        description: product?.description ?? '',
        sku: product?.sku ?? '',
        on_sale: !!product?.compareAtPrice,
        price: product?.compareAtPrice ? product?.price ?? '' : product?.price ?? '',
        compare_at_price: product?.compareAtPrice ?? '',
        stock_quantity: product?.stockQuantity ?? 0,
        is_active: product?.isActive ?? true,
        is_featured: product?.isFeatured ?? false,
        image: null as File | null,
        gallery_images: [] as File[],
        deleted_image_ids: [] as number[],
    });

    const [primaryPreview, setPrimaryPreview] = useState<string | null>(product?.imageUrl ?? null);
    const [existingGallery, setExistingGallery] = useState<{ id: number; url: string }[]>(product?.gallery ?? []);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (form.data.image) {
            const url = URL.createObjectURL(form.data.image);
            setPrimaryPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPrimaryPreview(product?.imageUrl ?? null);
        }
    }, [form.data.image]);

    useEffect(() => {
        if (form.data.gallery_images && form.data.gallery_images.length > 0) {
            const urls = form.data.gallery_images.map((file) => URL.createObjectURL(file));
            setGalleryPreviews(urls);
            return () => urls.forEach((url) => URL.revokeObjectURL(url));
        } else {
            setGalleryPreviews([]);
        }
    }, [form.data.gallery_images]);

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        form.setData('gallery_images', [...form.data.gallery_images, ...files]);
    };

    const removeExistingGalleryImage = (id: number) => {
        setExistingGallery(existingGallery.filter((img) => img.id !== id));
        form.setData('deleted_image_ids', [...form.data.deleted_image_ids, id]);
    };

    const removeNewGalleryImage = (index: number) => {
        form.setData(
            'gallery_images',
            form.data.gallery_images.filter((_, idx) => idx !== index)
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (form.data.on_sale) {
            const regular = Number(form.data.compare_at_price);
            const sale = Number(form.data.price);
            if (sale >= regular) {
                form.setError('price', 'Sale price must be less than the regular price.');
                return;
            }
        }

        form.clearErrors('price');

        if (product) {
            form.transform((data) => ({
                ...data,
                compare_at_price: data.on_sale ? data.compare_at_price : '',
                _method: 'patch',
            }));
            form.post(`/admin/products/${product.slug}`, {
                forceFormData: true,
            });
        } else {
            form.transform((data) => ({
                ...data,
                compare_at_price: data.on_sale ? data.compare_at_price : '',
            }));
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
                className="mt-6 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2"
            >
                <div className="grid gap-5">
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

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-bold text-slate-700">
                            Brand
                            <select
                                value={form.data.brand_id}
                                onChange={(event) => {
                                    const val = event.target.value;
                                    form.setData((d) => ({
                                        ...d,
                                        brand_id: val,
                                        brand_name: val === 'new' ? d.brand_name : '',
                                    }));
                                }}
                                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal shadow-sm outline-none focus:border-brand-blue"
                            >
                                <option value="">No brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                                <option value="new">+ Add custom brand...</option>
                            </select>
                        </label>

                        {form.data.brand_id === 'new' && (
                            <Field
                                label="Custom brand name"
                                value={form.data.brand_name}
                                error={form.errors.brand_name}
                                onChange={(value) => form.setData('brand_name', value)}
                                placeholder="Enter brand name"
                            />
                        )}
                    </div>

                    <label className="text-sm font-bold text-slate-700">
                        Categories
                        <CategoryMultiselect
                            categories={categories}
                            selectedIds={form.data.category_ids}
                            onChange={(ids) => form.setData('category_ids', ids)}
                            error={form.errors.category_ids}
                        />
                    </label>

                    <Field
                        label="SKU"
                        value={form.data.sku}
                        error={form.errors.sku}
                        onChange={(value) => form.setData('sku', value)}
                    />

                    {/* On Sale Section */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                        <label className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                            <input
                                type="checkbox"
                                checked={form.data.on_sale}
                                onChange={(event) => {
                                    const checked = event.target.checked;
                                    form.setData((d) => ({
                                        ...d,
                                        on_sale: checked,
                                        price: checked ? '' : d.compare_at_price || d.price,
                                        compare_at_price: checked ? d.price : '',
                                    }));
                                }}
                                className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue animate-pulse"
                            />
                            On sale?
                        </label>

                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            {form.data.on_sale ? (
                                <>
                                    <Field
                                        label="Regular price (NPR)"
                                        type="number"
                                        value={form.data.compare_at_price}
                                        error={form.errors.compare_at_price}
                                        onChange={(value) => form.setData('compare_at_price', value)}
                                    />
                                    <Field
                                        label="Sale price (NPR)"
                                        type="number"
                                        value={form.data.price}
                                        error={form.errors.price}
                                        onChange={(value) => form.setData('price', value)}
                                    />
                                </>
                            ) : (
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Regular price (NPR)"
                                        type="number"
                                        value={form.data.price}
                                        error={form.errors.price}
                                        onChange={(value) => form.setData('price', value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Field
                        label="Stock quantity"
                        type="number"
                        value={form.data.stock_quantity.toString()}
                        error={form.errors.stock_quantity}
                        onChange={(value) => form.setData('stock_quantity', Number(value))}
                    />
                </div>

                <div className="grid gap-5">
                    {/* Image Management Section */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Primary Image Upload */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <span className="block text-sm font-extrabold text-slate-800 mb-2">Primary Image</span>
                            <div className="relative flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 text-center transition hover:bg-slate-50">
                                {primaryPreview ? (
                                    <div className="relative size-full group">
                                        <img
                                            src={primaryPreview}
                                            alt="Primary Preview"
                                            className="h-full w-full rounded-lg object-cover shadow-sm animate-fade-in"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md hover:bg-slate-100">
                                                Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => form.setData('image', e.target.files?.[0] ?? null)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <span className="absolute top-2 left-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">
                                            Primary
                                        </span>
                                    </div>
                                ) : (
                                    <label className="flex size-full cursor-pointer flex-col items-center justify-center">
                                        <Upload className="h-8 w-8 text-slate-400" />
                                        <span className="mt-2 block text-xs font-semibold text-slate-700">Upload primary</span>
                                        <span className="mt-0.5 block text-[9px] text-slate-500">PNG, JPG up to 4MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => form.setData('image', e.target.files?.[0] ?? null)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <Error message={form.errors.image} />
                        </div>

                        {/* Gallery Images Upload */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <span className="block text-sm font-extrabold text-slate-800 mb-2">Gallery Images</span>
                            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[220px] p-0.5">
                                {/* Existing Gallery Images */}
                                {existingGallery.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg bg-white border border-slate-100 shadow-sm overflow-hidden group">
                                        <img
                                            src={img.url}
                                            alt="Gallery Image"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingGalleryImage(img.id)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-300"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Gallery Previews */}
                                {galleryPreviews.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg bg-white border border-slate-100 shadow-sm overflow-hidden group">
                                        <img
                                            src={url}
                                            alt="New Preview"
                                            className="h-full w-full object-cover animate-fade-in"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewGalleryImage(idx)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-300"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white transition hover:bg-slate-50">
                                    <Plus className="h-6 w-6 text-slate-400" />
                                    <span className="mt-0.5 block text-[8px] font-semibold text-slate-500">Add Image</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleGalleryChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <Error message={form.errors.gallery_images} />
                        </div>
                    </div>

                    <Textarea
                        label="Short description"
                        value={form.data.short_description}
                        error={form.errors.short_description}
                        onChange={(value) => form.setData('short_description', value)}
                    />
                    <Textarea
                        label="Full description"
                        value={form.data.description}
                        error={form.errors.description}
                        onChange={(value) => form.setData('description', value)}
                    />

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) => form.setData('is_active', event.target.checked)}
                                className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                            />
                            Visible in storefront
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.data.is_featured}
                                onChange={(event) => form.setData('is_featured', event.target.checked)}
                                className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                            />
                            Featured product
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 lg:col-span-2 border-t border-slate-100 pt-4">
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="bg-brand-orange font-bold hover:bg-brand-orange/90"
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

function CategoryMultiselect({
    categories,
    selectedIds,
    onChange,
    error,
}: {
    categories: Option[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    error?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCategory = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const selectedCategories = categories.filter((c) => selectedIds.includes(c.id));

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-2 flex min-h-[46px] w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left font-normal shadow-sm transition hover:border-slate-300 outline-none"
            >
                <div className="flex flex-wrap gap-1.5 pr-4">
                    {selectedCategories.length === 0 ? (
                        <span className="text-slate-400">Select categories...</span>
                    ) : (
                        selectedCategories.map((c) => (
                            <span
                                key={c.id}
                                className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"
                            >
                                {c.name}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(c.id);
                                    }}
                                    className="cursor-pointer text-slate-400 hover:text-slate-600 animate-fade-in"
                                >
                                    <X className="size-3" />
                                </span>
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown className={cn("size-4 text-slate-400 transition-transform shrink-0", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {categories.map((c) => {
                        const isSelected = selectedIds.includes(c.id);
                        return (
                            <label
                                key={c.id}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                                    isSelected ? "bg-slate-50/50 font-bold text-brand-blue" : "text-slate-700"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleCategory(c.id)}
                                    className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                />
                                {c.name}
                            </label>
                        );
                    })}
                </div>
            )}
            <Error message={error} />
        </div>
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
        <label className="text-sm font-bold text-slate-700 block">
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal shadow-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
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
        <label className="text-sm font-bold text-slate-700 block">
            {label}
            <textarea
                rows={4}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal shadow-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
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
