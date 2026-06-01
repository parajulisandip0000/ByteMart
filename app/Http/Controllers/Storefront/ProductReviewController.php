<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreProductReviewRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    public function store(StoreProductReviewRequest $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $product->reviews()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Thank you. Your review has been published.',
        ]);

        return to_route('products.show', $product);
    }
}
