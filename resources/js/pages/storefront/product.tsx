import { Head, Link, router, useForm } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import {
    CheckCircle2,
    Heart,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { SectionHeading } from '@/components/home/section-heading';
import { StorefrontLayout } from '@/components/layout/storefront-layout';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { formatNpr } from '@/lib/currency';
import {
    productToStorefrontItem,
    useCart,
    useWishlist,
} from '@/lib/storefront-storage';
import type { Product, ProductDetail } from '@/types';

interface ReviewFormData {
    name: string;
    email: string;
    rating: number;
    comment: string;
}

export default function ProductPage({
    product,
    relatedProducts,
}: {
    product: ProductDetail;
    relatedProducts: Product[];
}) {
    const reviewForm = useForm<ReviewFormData>({
        name: '',
        email: '',
        rating: 5,
        comment: '',
    });
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>(
        'description',
    );
    const cart = useCart();
    const wishlist = useWishlist();
    const storefrontItem = productToStorefrontItem(product);
    const wishlisted = wishlist.hasItem(product.id);

    const submitReview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        reviewForm.post(`/products/${product.slug}/reviews`, {
            preserveScroll: true,
            onSuccess: () => reviewForm.reset(),
        });
    };

    return (
        <>
            <Head title={product.name} />
            <StorefrontLayout>
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-6 text-sm text-slate-500">
                        <Link href="/shop" className="hover:text-brand-blue">
                            Shop
                        </Link>
                        <span> / </span>
                        {product.categorySlug && (
                            <Link
                                href={`/categories/${product.categorySlug}`}
                                className="hover:text-brand-blue"
                            >
                                {product.category}
                            </Link>
                        )}
                        <span> / {product.name}</span>
                    </div>
                    <div className="grid gap-9 lg:grid-cols-2">
                        <div className="overflow-hidden rounded-3xl bg-white">
                            {product.images[0] && (
                                <img
                                    src={product.images[0].url}
                                    alt={
                                        product.images[0].altText ??
                                        product.name
                                    }
                                    className="aspect-square w-full object-cover"
                                />
                            )}
                        </div>
                        <div className="py-3">
                            <p className="text-xs font-black tracking-[0.2em] text-brand-cyan uppercase">
                                {product.category}
                            </p>
                            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                                {product.name}
                            </h1>
                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                <StarRating rating={product.rating.average} />
                                <span className="font-bold text-slate-700">
                                    {product.rating.average.toFixed(1)}
                                </span>
                                <a
                                    href="#reviews"
                                    className="text-slate-500 hover:text-brand-blue"
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    {product.rating.count}{' '}
                                    {product.rating.count === 1
                                        ? 'review'
                                        : 'reviews'}
                                </a>
                            </div>
                            <div className="mt-5 flex items-end gap-3">
                                <p className="text-3xl font-black text-brand-blue">
                                    {formatNpr(product.variant.price)}
                                </p>
                                {product.variant.compareAtPrice && (
                                    <p className="pb-1 text-lg text-slate-400 line-through">
                                        {formatNpr(
                                            product.variant.compareAtPrice,
                                        )}
                                    </p>
                                )}
                            </div>
                            <p className="mt-6 leading-7 text-slate-600">
                                {product.shortDescription}
                            </p>
                            <div className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                                <p className="font-bold">
                                    Brand:{' '}
                                    <Link
                                        href={`/shop?brand=${product.brandSlug}`}
                                        className="font-medium text-brand-blue hover:text-brand-orange"
                                    >
                                        {product.brand}
                                    </Link>
                                </p>
                                <p className="font-bold">
                                    Category:{' '}
                                    <Link
                                        href={`/categories/${product.categorySlug}`}
                                        className="font-medium text-brand-blue hover:text-brand-orange"
                                    >
                                        {product.category}
                                    </Link>
                                </p>
                                <p className="font-bold">
                                    SKU:{' '}
                                    <span className="font-medium text-slate-500">
                                        {product.variant.sku}
                                    </span>
                                </p>
                            </div>
                            <p
                                className={`mt-2 text-sm font-bold ${product.variant.stockQuantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}
                            >
                                {product.variant.stockQuantity > 0
                                    ? `${product.variant.stockQuantity} items in stock`
                                    : 'Out of stock'}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-brand-blue px-8 font-bold"
                                    disabled={
                                        product.variant.stockQuantity === 0
                                    }
                                    onClick={() => cart.addItem(storefrontItem)}
                                >
                                    <ShoppingBag /> Add to cart
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full bg-brand-orange px-8 font-bold"
                                    disabled={
                                        product.variant.stockQuantity === 0
                                    }
                                    onClick={() => {
                                        if (cart.addItem(storefrontItem)) {
                                            router.visit('/cart');
                                        }
                                    }}
                                >
                                    <Zap /> Buy now
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-6 font-bold"
                                    onClick={() =>
                                        wishlist.toggleItem(storefrontItem)
                                    }
                                >
                                    <Heart
                                        className={
                                            wishlisted
                                                ? 'fill-brand-orange text-brand-orange'
                                                : ''
                                        }
                                    />{' '}
                                    {wishlisted
                                        ? 'Remove from wishlist'
                                        : 'Add to wishlist'}
                                </Button>
                            </div>
                            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-2">
                                <p className="flex gap-2">
                                    <Truck className="size-5 text-brand-blue" />{' '}
                                    Delivery across Nepal
                                </p>
                                <p className="flex gap-2">
                                    <ShieldCheck className="size-5 text-brand-blue" />{' '}
                                    Secure shopping
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    id="reviews"
                    className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"
                >
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex border-b border-slate-200 px-5 sm:px-8">
                            <TabButton
                                active={activeTab === 'description'}
                                onClick={() => setActiveTab('description')}
                            >
                                Full description
                            </TabButton>
                            <TabButton
                                active={activeTab === 'reviews'}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews ({product.rating.count})
                            </TabButton>
                        </div>
                        {activeTab === 'description' ? (
                            <div className="p-6 sm:p-8">
                                <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                                    Product details
                                </p>
                                <h2 className="mt-3 text-2xl font-black text-slate-950">
                                    Full product description
                                </h2>
                                <p className="mt-4 max-w-4xl leading-8 text-slate-600">
                                    {product.longDescription}
                                </p>
                                <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-3">
                                    <Benefit
                                        icon={<Truck />}
                                        title="Delivery across Nepal"
                                        description="Reliable delivery with order support."
                                    />
                                    <Benefit
                                        icon={<ShieldCheck />}
                                        title="Secure shopping"
                                        description="Shop confidently with ByteMart."
                                    />
                                    <Benefit
                                        icon={<CheckCircle2 />}
                                        title="Selected for quality"
                                        description="Practical products for everyday use."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 sm:p-8">
                                <div className="border-b border-slate-200 pb-7">
                                    <p className="text-xs font-black tracking-[0.2em] text-brand-orange uppercase">
                                        Customer feedback
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-end gap-4">
                                        <h2 className="text-2xl font-black text-slate-950">
                                            Reviews and ratings
                                        </h2>
                                        <div className="flex items-center gap-2 pb-0.5">
                                            <StarRating
                                                rating={product.rating.average}
                                            />
                                            <span className="text-sm font-bold text-slate-700">
                                                {product.rating.average.toFixed(
                                                    1,
                                                )}{' '}
                                                from {product.rating.count}{' '}
                                                {product.rating.count === 1
                                                    ? 'review'
                                                    : 'reviews'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-8 pt-7">
                                    <div>
                                        {product.reviews.length > 0 ? (
                                            <div className="grid gap-4">
                                                {product.reviews.map(
                                                    (review) => (
                                                        <article
                                                            key={review.id}
                                                            className="rounded-2xl border border-slate-200 p-5"
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                                <div>
                                                                    <h3 className="font-black text-slate-900">
                                                                        {
                                                                            review.name
                                                                        }
                                                                    </h3>
                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        {
                                                                            review.createdAt
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <StarRating
                                                                    rating={
                                                                        review.rating
                                                                    }
                                                                />
                                                            </div>
                                                            <p className="mt-4 leading-7 text-slate-600">
                                                                {review.comment}
                                                            </p>
                                                        </article>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="rounded-2xl border border-slate-200 p-5 text-slate-500">
                                                No reviews yet. Share your
                                                experience with this product.
                                            </p>
                                        )}
                                    </div>
                                    <ReviewForm
                                        reviewForm={reviewForm}
                                        onSubmit={submitReview}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                {relatedProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="More to explore"
                            title="Related products"
                        />
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </section>
                )}
            </StorefrontLayout>
        </>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`border-b-2 px-3 py-5 text-sm font-black transition sm:px-5 ${
                active
                    ? 'border-brand-orange text-brand-blue'
                    : 'border-transparent text-slate-500 hover:text-brand-blue'
            }`}
        >
            {children}
        </button>
    );
}

function Benefit({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-sky/50 text-brand-blue [&_svg]:size-5">
                {icon}
            </span>
            <p>
                <strong className="block text-slate-900">{title}</strong>
                <span className="mt-1 block">{description}</span>
            </p>
        </div>
    );
}

function ReviewForm({
    reviewForm,
    onSubmit,
}: {
    reviewForm: InertiaFormProps<ReviewFormData>;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
        >
            <h3 className="text-xl font-black text-slate-950">
                Write a review
            </h3>
            <p className="mt-2 text-sm text-slate-500">
                Your email address will not be published.
            </p>
            <label className="mt-5 block text-sm font-bold text-slate-700">
                Rating
                <span className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            aria-label={`${rating} star rating`}
                            onClick={() => reviewForm.setData('rating', rating)}
                        >
                            <Star
                                className={`size-7 ${
                                    rating <= reviewForm.data.rating
                                        ? 'fill-brand-yellow text-brand-yellow'
                                        : 'text-slate-300'
                                }`}
                            />
                        </button>
                    ))}
                </span>
                <FieldError message={reviewForm.errors.rating} />
            </label>
            <div className="grid gap-x-4 sm:grid-cols-2">
                <FormField
                    label="Name"
                    name="name"
                    value={reviewForm.data.name}
                    error={reviewForm.errors.name}
                    onChange={(value) => reviewForm.setData('name', value)}
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={reviewForm.data.email}
                    error={reviewForm.errors.email}
                    onChange={(value) => reviewForm.setData('email', value)}
                />
            </div>
            <label className="mt-4 block text-sm font-bold text-slate-700">
                Comment
                <textarea
                    name="comment"
                    rows={5}
                    value={reviewForm.data.comment}
                    onChange={(event) =>
                        reviewForm.setData('comment', event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
                />
                <FieldError message={reviewForm.errors.comment} />
            </label>
            <Button
                type="submit"
                className="mt-5 bg-brand-orange px-8 font-bold"
                disabled={reviewForm.processing}
            >
                Submit review
            </Button>
        </form>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <span
            className="flex gap-0.5 text-brand-yellow"
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`size-4 ${star <= Math.round(rating) ? 'fill-current' : 'text-slate-300'}`}
                />
            ))}
        </span>
    );
}

function FormField({
    label,
    name,
    type = 'text',
    value,
    error,
    onChange,
}: {
    label: string;
    name: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="mt-4 block text-sm font-bold text-slate-700">
            {label}
            <input
                name={name}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal outline-none focus:border-brand-cyan focus:ring-3 focus:ring-brand-sky/60"
            />
            <FieldError message={error} />
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <span className="mt-1 block text-xs font-semibold text-red-600">
            {message}
        </span>
    ) : null;
}
