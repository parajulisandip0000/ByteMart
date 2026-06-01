<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchSuggestionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('q'));

        if (mb_strlen($search) < 2) {
            return response()->json($this->emptySuggestions());
        }

        $search = '%'.$this->escapeLike($search).'%';

        return response()->json([
            'products' => Product::query()
                ->active()
                ->where('name', 'like', $search)
                ->with(['images' => fn ($query) => $query->where('is_primary', true)->orderBy('sort_order')])
                ->limit(5)
                ->get()
                ->map(fn (Product $product) => [
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'imageUrl' => $product->images->first()?->url,
                ]),
            'categories' => Category::query()
                ->where('is_active', true)
                ->where('name', 'like', $search)
                ->orderBy('sort_order')
                ->limit(4)
                ->get(['name', 'slug']),
            'brands' => Brand::query()
                ->active()
                ->where('name', 'like', $search)
                ->orderBy('name')
                ->limit(4)
                ->get(['name', 'slug']),
        ]);
    }

    private function emptySuggestions(): array
    {
        return [
            'products' => [],
            'categories' => [],
            'brands' => [],
        ];
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }
}
