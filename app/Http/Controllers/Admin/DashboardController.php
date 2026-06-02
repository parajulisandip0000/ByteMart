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
        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'customers' => User::where('role', 'customer')->count(),
                'lowStock' => ProductVariant::where('stock_quantity', '<=', 5)->count(),
                'reviews' => ProductReview::count(),
                'orders' => Order::count(),
            ],
            'recentLogs' => ActivityLog::with('user:id,name')
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'user' => $log->user?->name ?? 'System',
                    'createdAt' => $log->created_at->toDateTimeString(),
                ]),
        ]);
    }
}
