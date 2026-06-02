<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        // 1. Top Products Queries
        $topWishlistProduct = Product::query()
            ->active()
            ->with(['images' => fn($q) => $q->where('is_primary', true)->orderBy('sort_order'), 'categories'])
            ->orderByDesc('wishlist_count')
            ->first();

        $topCartProduct = Product::query()
            ->active()
            ->with(['images' => fn($q) => $q->where('is_primary', true)->orderBy('sort_order'), 'categories'])
            ->orderByDesc('cart_count')
            ->first();

        $mostPurchasedData = \App\Models\OrderItem::query()
            ->select('product_id', \Illuminate\Support\Facades\DB::raw('SUM(quantity) as total_purchased'))
            ->groupBy('product_id')
            ->orderByDesc('total_purchased')
            ->first();

        $mostPurchasedProduct = $mostPurchasedData
            ? Product::query()->active()->with(['images' => fn($q) => $q->where('is_primary', true)->orderBy('sort_order'), 'categories'])->find($mostPurchasedData->product_id)
            : null;

        $mostPurchasedCount = $mostPurchasedData ? (int) $mostPurchasedData->total_purchased : 0;

        $leastPurchasedData = Product::query()
            ->active()
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->select('products.id', \Illuminate\Support\Facades\DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_purchased'))
            ->groupBy('products.id')
            ->orderBy('total_purchased', 'asc')
            ->first();

        $leastPurchasedProduct = $leastPurchasedData
            ? Product::query()->active()->with(['images' => fn($q) => $q->where('is_primary', true)->orderBy('sort_order'), 'categories'])->find($leastPurchasedData->id)
            : null;

        $leastPurchasedCount = $leastPurchasedData ? (int) $leastPurchasedData->total_purchased : 0;

        // 2. Format Top Products
        $topWishlist = $topWishlistProduct ? [
            'name' => $topWishlistProduct->name,
            'slug' => $topWishlistProduct->slug,
            'category' => $topWishlistProduct->categories->first()?->name ?? 'N/A',
            'imageUrl' => $topWishlistProduct->images->first()?->url ?? null,
            'count' => $topWishlistProduct->wishlist_count,
        ] : null;

        $topCart = $topCartProduct ? [
            'name' => $topCartProduct->name,
            'slug' => $topCartProduct->slug,
            'category' => $topCartProduct->categories->first()?->name ?? 'N/A',
            'imageUrl' => $topCartProduct->images->first()?->url ?? null,
            'count' => $topCartProduct->cart_count,
        ] : null;

        $mostPurchased = $mostPurchasedProduct ? [
            'name' => $mostPurchasedProduct->name,
            'slug' => $mostPurchasedProduct->slug,
            'category' => $mostPurchasedProduct->categories->first()?->name ?? 'N/A',
            'imageUrl' => $mostPurchasedProduct->images->first()?->url ?? null,
            'count' => $mostPurchasedCount,
        ] : null;

        $leastPurchased = $leastPurchasedProduct ? [
            'name' => $leastPurchasedProduct->name,
            'slug' => $leastPurchasedProduct->slug,
            'category' => $leastPurchasedProduct->categories->first()?->name ?? 'N/A',
            'imageUrl' => $leastPurchasedProduct->images->first()?->url ?? null,
            'count' => $leastPurchasedCount,
        ] : null;

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'customers' => User::where('role', 'customer')->count(),
                'lowStock' => ProductVariant::where('stock_quantity', '<=', 5)->count(),
                'reviews' => ProductReview::count(),
                'orders' => Order::count(),
            ],
            'analytics' => [
                'topWishlist' => $topWishlist,
                'topCart' => $topCart,
                'mostPurchased' => $mostPurchased,
                'leastPurchased' => $leastPurchased,
                'totalRevenue' => (float) Order::sum('total'),
                'averageOrderValue' => (float) (Order::avg('total') ?? 0.0),
                'totalWishlists' => (int) Product::sum('wishlist_count'),
                'totalCarts' => (int) Product::sum('cart_count'),
            ]
        ]);
    }
}
