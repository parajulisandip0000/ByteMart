import { Head, router, useForm } from '@inertiajs/react';
import { Search, Star, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { AdminPageHeader } from '@/components/admin/page-header';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';

interface Review {
    id: number;
    product: string | null;
    name: string;
    email: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
}

interface Reviews {
    data: Review[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function ReviewsIndex({
    reviews,
    filters,
}: {
    reviews: Reviews;
    filters: { search: string };
}) {
    const search = useForm({ search: filters?.search ?? '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        search.get('/admin/reviews', { preserveState: true });
    };

    return (
        <>
            <Head title="Product reviews" />
            <AdminPageHeader
                eyebrow="Customer feedback"
                title="Product reviews"
                description="Review customer feedback across the storefront. Moderation actions can be added when the review workflow requires approval queues."
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
                    placeholder="Search reviewer or product name"
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
                />
                <Button type="submit" className="bg-brand-blue font-bold">
                    Search
                </Button>
            </form>
            <div className="mt-6 grid gap-4">
                {reviews.data.map((review) => (
                    <article
                        key={review.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <p className="font-black">{review.product}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {review.name} · {review.email}
                                </p>
                            </div>
                            <span className="flex items-center gap-1 text-sm font-black text-brand-orange">
                                <Star className="size-4 fill-current" />
                                {review.rating}/5
                            </span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                            {review.comment}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-slate-400">
                                {review.createdAt} ·{' '}
                                {review.isApproved ? 'Published' : 'Hidden'}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        router.patch(
                                            `/admin/reviews/${review.id}`,
                                            {
                                                is_approved: !review.isApproved,
                                            },
                                        )
                                    }
                                >
                                    {review.isApproved
                                        ? 'Unpublish'
                                        : 'Publish'}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    aria-label="Delete review"
                                    onClick={() => {
                                        if (confirm('Delete this review?')) {
                                            router.delete(
                                                `/admin/reviews/${review.id}`,
                                            );
                                        }
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    </article>
                ))}
                {reviews.data.length === 0 && (
                    <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        No product reviews have been submitted yet.
                    </p>
                )}
            </div>
            <Pagination links={reviews.links} />
        </>
    );
}
