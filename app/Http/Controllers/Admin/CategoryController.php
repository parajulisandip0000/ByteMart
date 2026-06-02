<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::with('parent:id,name')->withCount('products')->orderBy('sort_order')->orderBy('name')->get()->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parent' => $category->parent?->name,
                'parentId' => $category->parent_id,
                'imageUrl' => $category->image_url,
                'sortOrder' => $category->sort_order,
                'isActive' => $category->is_active,
                'productsCount' => $category->products_count,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        DB::transaction(function () use ($data, $request) {
            $category = Category::create($this->categoryData($data, $request));
            ActivityLogger::log($request, 'category.created', "Created category {$category->name}.", $category);
        });
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category created successfully.']);

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $this->validated($request, $category);
        DB::transaction(function () use ($data, $request, $category) {
            $category->update($this->categoryData($data, $request, $category));
            ActivityLogger::log($request, 'category.updated', "Updated category {$category->name}.", $category);
        });
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category updated successfully.']);

        return back();
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_if($category->products()->exists(), 422, 'Remove products from this category before deleting it.');
        $name = $category->name;
        DB::transaction(function () use ($request, $category, $name) {
            $category->delete();
            ActivityLogger::log($request, 'category.deleted', "Deleted category {$name}.");
        });
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category deleted successfully.']);

        return back();
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        $request->merge(['slug' => $request->input('slug') ?: Str::slug($request->string('name')->toString())]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category)],
            'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn([$category?->id])],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);
    }

    private function categoryData(array $data, Request $request, ?Category $category = null): array
    {
        $imageUrl = $category?->image_url;

        if ($request->hasFile('image')) {
            $imageUrl = Storage::url($request->file('image')->store('categories', 'public'));
        }

        return [
            'name' => $data['name'],
            'slug' => $data['slug'] ?: Str::slug($data['name']),
            'parent_id' => $data['parent_id'] ?? null,
            'sort_order' => $data['sort_order'],
            'is_active' => $data['is_active'] ?? false,
            'image_url' => $imageUrl,
        ];
    }
}
