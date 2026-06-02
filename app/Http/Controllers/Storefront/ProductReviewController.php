<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreProductReviewRequest;
use App\Models\Product;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    public function store(StoreProductReviewRequest $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $review = $product->reviews()->create($request->validated());
        ActivityLogger::log(
            $request,
            'review.submitted',
            "Submitted a review for {$product->name}.",
            $review,
            actorType: $request->user() ? 'customer' : 'guest',
            actorName: $review->name,
            actorEmail: $review->email,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Thank you. Your review has been published.',
        ]);

        return to_route('products.show', $product);
    }
}
