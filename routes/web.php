<?php

use App\Http\Controllers\Storefront\CategoryController;
use App\Http\Controllers\Storefront\ContentPageController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category}', [ShopController::class, 'category'])->name('categories.show');
Route::get('/deals', [ShopController::class, 'deals'])->name('deals.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('/about', [ContentPageController::class, 'about'])->name('about');
Route::get('/delivery', [ContentPageController::class, 'delivery'])->name('delivery');
Route::get('/returns', [ContentPageController::class, 'returns'])->name('returns');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
