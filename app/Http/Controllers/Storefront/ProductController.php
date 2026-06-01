<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\ProductCardResource;
use App\Http\Resources\Storefront\ProductDetailResource;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load([
            'categories:id,name,slug',
            'images' => fn ($query) => $query->orderByDesc('is_primary')->orderBy('sort_order'),
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
}
