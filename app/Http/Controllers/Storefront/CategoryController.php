<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\CategoryResource;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/categories', [
            'categories' => CategoryResource::collection(
                Category::query()->where('is_active', true)->whereNull('parent_id')->withCount('products')->orderBy('sort_order')->get(),
            )->resolve(),
        ]);
    }
}
