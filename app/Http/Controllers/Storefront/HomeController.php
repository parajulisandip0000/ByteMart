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
        // 1. Categories (no limit to support sliding carousel when > 6)
        $categories = Category::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'image_url']);

        // Base product relations
        $productRelations = [
            'categories:id,name',
            'images' => fn ($query) => $query->where('is_primary', true)->orderBy('sort_order'),
            'variants' => fn ($query) => $query->where('is_default', true),
        ];

        // 2. Featured Products (up to 24)
        $featuredProducts = Product::query()
            ->active()
            ->where('is_featured', true)
            ->with($productRelations)
            ->limit(24)
            ->get();

        // 3. Sales Products (active products with price < compare_at_price)
        $saleProducts = Product::query()
            ->active()
            ->whereHas('variants', function ($query) {
                $query->where('is_default', true)
                    ->whereNotNull('compare_at_price')
                    ->whereColumn('compare_at_price', '>', 'price');
            })
            ->with($productRelations)
            ->limit(6)
            ->get();

        // 4. Top Rated Products (sorted by average review rating)
        $topRatedProducts = Product::query()
            ->active()
            ->withAvg(['reviews' => fn ($query) => $query->approved()], 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->with($productRelations)
            ->limit(6)
            ->get();

        // 5. Most Purchased Products (sorted by sum of quantity purchased)
        $mostPurchasedProducts = Product::query()
            ->active()
            ->withSum('orderItems as sold_count', 'quantity')
            ->orderByDesc('sold_count')
            ->with($productRelations)
            ->limit(6)
            ->get();

        return Inertia::render('storefront/home', [
            'categories' => $categories->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'imageUrl' => $category->image_url,
            ]),
            'featuredProducts' => $featuredProducts->map(fn (Product $p) => $this->mapProduct($p)),
            'saleProducts' => $saleProducts->map(fn (Product $p) => $this->mapProduct($p)),
            'topRatedProducts' => $topRatedProducts->map(fn (Product $p) => $this->mapProduct($p)),
            'mostPurchasedProducts' => $mostPurchasedProducts->map(fn (Product $p) => $this->mapProduct($p)),
        ]);
    }

    private function mapProduct(Product $product): array
    {
        $variant = $product->variants->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'category' => $product->categories->first()?->name,
            'imageUrl' => $product->images->first()?->url,
            'price' => $variant?->price,
            'compareAtPrice' => $variant?->compare_at_price,
            'inStock' => ($variant?->stock_quantity ?? 0) > 0,
        ];
    }
}
