<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\ProductCardResource;
use App\Http\Resources\Storefront\ProductDetailResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load([
            'brand:id,name,slug',
            'categories:id,name,slug',
            'images' => fn ($query) => $query->orderByDesc('is_primary')->orderBy('sort_order'),
            'reviews' => fn ($query) => $query->approved()->latest('id'),
            'variants' => fn ($query) => $query->orderByDesc('is_default'),
        ]);

        $relatedProducts = Product::query()
            ->active()
            ->whereKeyNot($product->getKey())
            ->whereHas('categories', fn ($query) => $query->whereIn('categories.id', $product->categories->pluck('id')))
            ->with([
                'categories:id,name,slug',
                'images' => fn ($query) => $query->where('is_primary', true)->orderBy('sort_order'),
                'variants' => fn ($query) => $query->where('is_default', true),
            ])
            ->limit(4)
            ->get();

        return Inertia::render('storefront/product', [
            'product' => ProductDetailResource::make($product)->resolve(),
            'relatedProducts' => ProductCardResource::collection($relatedProducts)->resolve(),
        ]);
    }

    public function trackWishlist(Request $request, Product $product): JsonResponse
    {
        $action = $request->input('action');

        if ($action === 'add') {
            $product->increment('wishlist_count');
        } elseif ($action === 'remove') {
            if ($product->wishlist_count > 0) {
                $product->decrement('wishlist_count');
            }
        }

        return response()->json(['success' => true, 'wishlist_count' => $product->wishlist_count]);
    }

    public function trackCart(Request $request, Product $product): JsonResponse
    {
        $delta = (int) $request->input('delta', 0);

        if ($delta > 0) {
            $product->increment('cart_count', $delta);
        } elseif ($delta < 0) {
            $absDelta = abs($delta);
            if ($product->cart_count >= $absDelta) {
                $product->decrement('cart_count', $absDelta);
            } else {
                $product->cart_count = 0;
                $product->save();
            }
        }

        return response()->json(['success' => true, 'cart_count' => $product->cart_count]);
    }
}
