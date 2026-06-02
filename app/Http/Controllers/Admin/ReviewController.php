<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reviews/index', [
            'reviews' => ProductReview::with('product:id,name,slug')->latest()->paginate(20)->through(fn (ProductReview $review) => [
                'id' => $review->id,
                'product' => $review->product?->name,
                'name' => $review->name,
                'email' => $review->email,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'isApproved' => $review->is_approved,
                'createdAt' => $review->created_at->toDateTimeString(),
            ]),
        ]);
    }

    public function update(Request $request, ProductReview $review): RedirectResponse
    {
        $review->update($request->validate(['is_approved' => ['required', 'boolean']]));
        ActivityLogger::log($request, 'review.updated', "Updated review {$review->id} visibility.", $review);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review visibility updated successfully.']);

        return back();
    }

    public function destroy(Request $request, ProductReview $review): RedirectResponse
    {
        $id = $review->id;
        $review->delete();
        ActivityLogger::log($request, 'review.deleted', "Deleted review {$id}.");
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Review deleted successfully.']);

        return back();
    }
}
