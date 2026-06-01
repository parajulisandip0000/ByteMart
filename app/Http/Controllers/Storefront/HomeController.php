<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->limit(6)
            ->get(['id', 'name', 'slug', 'image_url']);

        $products = Product::query()
            ->active()
            ->where('is_featured', true)
            ->with([
                'categories:id,name',
                'images' => fn ($query) => $query->where('is_primary', true)->orderBy('sort_order'),
                'variants' => fn ($query) => $query->where('is_default', true),
            ])
            ->limit(6)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->categories->first()?->name,
                'imageUrl' => $product->images->first()?->url,
                'price' => $product->variants->first()?->price,
                'compareAtPrice' => $product->variants->first()?->compare_at_price,
                'inStock' => ($product->variants->first()?->stock_quantity ?? 0) > 0,
            ]);

        return Inertia::render('storefront/home', [
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'imageUrl' => $category->image_url,
            ]),
            'featuredProducts' => $products,
        ]);
    }
}
