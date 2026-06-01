<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\CategoryResource;
use App\Http\Resources\Storefront\ProductCardResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        return $this->render($request);
    }

    public function category(Request $request, Category $category): Response
    {
        abort_unless($category->is_active, 404);

        return $this->render($request, $category);
    }

    public function deals(Request $request): Response
    {
        return $this->render($request, dealsOnly: true);
    }

    private function render(Request $request, ?Category $category = null, bool $dealsOnly = false): Response
    {
        $search = trim((string) $request->string('q'));
        $sort = $request->string('sort')->value();
        $priceBounds = ProductVariant::query()
            ->where('is_default', true)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();
        $minimumPrice = (int) floor((float) $priceBounds?->min_price);
        $maximumPrice = (int) ceil((float) $priceBounds?->max_price);
        $selectedMinimumPrice = $request->filled('min_price')
            ? max($minimumPrice, $request->integer('min_price'))
            : $minimumPrice;
        $selectedMaximumPrice = $request->filled('max_price')
            ? max($minimumPrice, min($maximumPrice, $request->integer('max_price')))
            : $maximumPrice;
        $selectedMinimumPrice = min($selectedMinimumPrice, $selectedMaximumPrice);
        $inStockOnly = $request->boolean('in_stock');
        $onSaleOnly = $dealsOnly || $request->boolean('on_sale');

        $products = Product::query()
            ->active()
            ->when($category, fn (Builder $query) => $query->whereHas(
                'categories',
                fn (Builder $categoryQuery) => $categoryQuery->whereKey($category->getKey()),
            ))
            ->when($onSaleOnly, fn (Builder $query) => $query->whereHas(
                'variants',
                fn (Builder $variantQuery) => $variantQuery
                    ->where('is_default', true)
                    ->whereNotNull('compare_at_price')
                    ->whereColumn('compare_at_price', '>', 'price'),
            ))
            ->whereHas('variants', fn (Builder $variantQuery) => $variantQuery
                ->where('is_default', true)
                ->whereBetween('price', [$selectedMinimumPrice, $selectedMaximumPrice])
                ->when($inStockOnly, fn (Builder $stockQuery) => $stockQuery->where('stock_quantity', '>', 0)))
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $searchQuery) use ($search) {
                $searchQuery
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->with($this->cardRelations())
            ->when($sort === 'price-low', fn (Builder $query) => $query->orderBy(
                Product::query()->select('price')
                    ->from('product_variants')
                    ->whereColumn('product_id', 'products.id')
                    ->where('is_default', true)
                    ->limit(1),
            ))
            ->when($sort === 'price-high', fn (Builder $query) => $query->orderByDesc(
                Product::query()->select('price')
                    ->from('product_variants')
                    ->whereColumn('product_id', 'products.id')
                    ->where('is_default', true)
                    ->limit(1),
            ))
            ->when(! in_array($sort, ['price-low', 'price-high'], true), fn (Builder $query) => $query->latest())
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product) => ProductCardResource::make($product)->resolve());

        return Inertia::render('storefront/shop', [
            'categories' => CategoryResource::collection(
                Category::query()->where('is_active', true)->whereNull('parent_id')->withCount('products')->orderBy('sort_order')->get(),
            )->resolve(),
            'products' => $products,
            'filters' => [
                'q' => $search,
                'sort' => $sort,
                'category' => $category?->slug,
                'minPrice' => $selectedMinimumPrice,
                'maxPrice' => $selectedMaximumPrice,
                'inStock' => $inStockOnly,
                'onSale' => $onSaleOnly,
            ],
            'filterOptions' => [
                'minPrice' => $minimumPrice,
                'maxPrice' => $maximumPrice,
            ],
            'pageTitle' => $dealsOnly ? 'Weekend deals' : ($category?->name ?? 'Shop all products'),
            'pageDescription' => $dealsOnly
                ? 'Limited-time savings on selected ByteMart favorites.'
                : ($category ? "Explore our {$category->name} collection." : 'Browse quality essentials selected for everyday life.'),
            'dealsOnly' => $dealsOnly,
        ]);
    }

    private function cardRelations(): array
    {
        return [
            'categories:id,name,slug',
            'images' => fn ($query) => $query->where('is_primary', true)->orderBy('sort_order'),
            'variants' => fn ($query) => $query->where('is_default', true),
        ];
    }
}
