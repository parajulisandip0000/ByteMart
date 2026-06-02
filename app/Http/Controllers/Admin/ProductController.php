<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('admin/products/index', [
            'products' => Product::with(['brand:id,name', 'categories:id,name', 'variants', 'images'])
                ->withSum('orderItems as sold_count', 'quantity')
                ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(12)
                ->withQueryString()
                ->through(fn (Product $product) => $this->productRow($product)),
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $product = DB::transaction(function () use (&$data, $request) {
            if (isset($data['brand_id']) && $data['brand_id'] === 'new' && !empty($data['brand_name'])) {
                $brand = Brand::firstOrCreate(
                    ['name' => $data['brand_name']],
                    ['slug' => Str::slug($data['brand_name']), 'is_active' => true]
                );
                $data['brand_id'] = $brand->id;
            }

            $product = Product::create($this->productData($data));
            $product->categories()->sync($data['category_ids']);
            $product->variants()->create($this->variantData($data));

            if ($request->hasFile('image')) {
                $this->storeImage($product, $request);
            }

            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $file) {
                    $path = $file->store('products', 'public');
                    $product->images()->create([
                        'url' => Storage::url($path),
                        'alt_text' => $product->name,
                        'is_primary' => false,
                    ]);
                }
            }

            return $product;
        });

        ActivityLogger::log($request, 'product.created', "Created product {$product->name}.", $product);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created successfully.']);

        return to_route('admin.products.index');
    }

    public function edit(Product $product): Response
    {
        $product->load(['categories:id', 'variants', 'images']);
        $variant = $product->variants->first();

        return Inertia::render('admin/products/form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'brandId' => $product->brand_id,
                'categoryIds' => $product->categories->pluck('id'),
                'shortDescription' => $product->short_description,
                'description' => $product->description,
                'isActive' => $product->is_active,
                'isFeatured' => $product->is_featured,
                'sku' => $variant?->sku ?? '',
                'price' => $variant?->price ?? '',
                'compareAtPrice' => $variant?->compare_at_price ?? '',
                'stockQuantity' => $variant?->stock_quantity ?? 0,
                'imageUrl' => $product->images->where('is_primary', true)->first()?->url,
                'gallery' => $product->images->where('is_primary', false)->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                ])->values(),
            ],
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validated($request, $product);

        DB::transaction(function () use (&$data, $request, $product) {
            if (isset($data['brand_id']) && $data['brand_id'] === 'new' && !empty($data['brand_name'])) {
                $brand = Brand::firstOrCreate(
                    ['name' => $data['brand_name']],
                    ['slug' => Str::slug($data['brand_name']), 'is_active' => true]
                );
                $data['brand_id'] = $brand->id;
            }

            $product->update($this->productData($data));
            $product->categories()->sync($data['category_ids']);
            $product->variants()->updateOrCreate(['is_default' => true], $this->variantData($data));

            if ($request->hasFile('image')) {
                $primaryImage = $product->images()->where('is_primary', true)->first();
                if ($primaryImage) {
                    if (Str::startsWith($primaryImage->url, '/storage/')) {
                        Storage::disk('public')->delete(Str::after($primaryImage->url, '/storage/'));
                    }
                    $primaryImage->delete();
                }
                $this->storeImage($product, $request);
            }

            if ($request->has('deleted_image_ids')) {
                $deletedIds = $request->input('deleted_image_ids');
                if (is_array($deletedIds)) {
                    $imagesToDelete = $product->images()->whereIn('id', $deletedIds)->get();
                    foreach ($imagesToDelete as $img) {
                        if (Str::startsWith($img->url, '/storage/')) {
                            Storage::disk('public')->delete(Str::after($img->url, '/storage/'));
                        }
                        $img->delete();
                    }
                }
            }

            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $file) {
                    $path = $file->store('products', 'public');
                    $product->images()->create([
                        'url' => Storage::url($path),
                        'alt_text' => $product->name,
                        'is_primary' => false,
                    ]);
                }
            }
        });

        ActivityLogger::log($request, 'product.updated', "Updated product {$product->name}.", $product);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product updated successfully.']);

        return to_route('admin.products.index');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $name = $product->name;
        $this->deleteImages($product);
        $product->delete();
        ActivityLogger::log($request, 'product.deleted', "Deleted product {$name}.");
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted successfully.']);

        return back();
    }

    private function validated(Request $request, ?Product $product = null): array
    {
        $variant = $product?->variants()->first();
        $request->merge(['slug' => $request->input('slug') ?: Str::slug($request->string('name')->toString())]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('products')->ignore($product)],
            'brand_id' => ['nullable', 'string'],
            'brand_name' => ['nullable', 'required_if:brand_id,new', 'string', 'max:255'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'short_description' => ['required', 'string', 'max:1000'],
            'description' => ['required', 'string'],
            'sku' => ['required', 'string', 'max:255', Rule::unique('product_variants')->ignore($variant)],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'gt:price'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'image' => [$product ? 'nullable' : 'required', 'image', 'max:4096'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'max:4096'],
            'deleted_image_ids' => ['nullable', 'array'],
            'deleted_image_ids.*' => ['integer', 'exists:product_images,id'],
        ], [
            'compare_at_price.gt' => 'The original price must be greater than the sale price.',
        ]);
    }

    private function productData(array $data): array
    {
        return [
            'name' => $data['name'],
            'slug' => $data['slug'] ?: Str::slug($data['name']),
            'brand_id' => (isset($data['brand_id']) && $data['brand_id'] && $data['brand_id'] !== 'new') ? (int) $data['brand_id'] : null,
            'short_description' => $data['short_description'],
            'description' => $data['description'],
            'is_active' => $data['is_active'] ?? false,
            'is_featured' => $data['is_featured'] ?? false,
        ];
    }

    private function variantData(array $data): array
    {
        return [
            'name' => 'Default',
            'sku' => $data['sku'],
            'price' => $data['price'],
            'compare_at_price' => $data['compare_at_price'] ?: null,
            'stock_quantity' => $data['stock_quantity'],
            'is_default' => true,
        ];
    }

    private function formOptions(): array
    {
        return [
            'brands' => Brand::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ];
    }

    private function storeImage(Product $product, Request $request): void
    {
        $path = $request->file('image')->store('products', 'public');
        $product->images()->create([
            'url' => Storage::url($path),
            'alt_text' => $product->name,
            'is_primary' => true,
        ]);
    }

    private function deleteImages(Product $product): void
    {
        foreach ($product->images as $image) {
            if (Str::startsWith($image->url, '/storage/')) {
                Storage::disk('public')->delete(Str::after($image->url, '/storage/'));
            }
        }
    }

    private function productRow(Product $product): array
    {
        $variant = $product->variants->first();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'brand' => $product->brand?->name,
            'categories' => $product->categories->pluck('name'),
            'price' => $variant?->price,
            'stockQuantity' => $variant?->stock_quantity ?? 0,
            'soldCount' => (int) ($product->sold_count ?? 0),
            'isActive' => $product->is_active,
            'imageUrl' => $product->images->first()?->url,
        ];
    }
}
