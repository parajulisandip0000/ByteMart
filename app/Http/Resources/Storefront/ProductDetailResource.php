<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variant = $this->variants->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'shortDescription' => $this->short_description,
            'longDescription' => $this->description,
            'brand' => $this->brand?->name,
            'brandSlug' => $this->brand?->slug,
            'category' => $this->categories->first()?->name,
            'categorySlug' => $this->categories->first()?->slug,
            'rating' => [
                'average' => round((float) $this->reviews->avg('rating'), 1),
                'count' => $this->reviews->count(),
            ],
            'reviews' => $this->reviews->map(fn ($review) => [
                'id' => $review->id,
                'name' => $review->name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'createdAt' => $review->created_at->toFormattedDateString(),
            ]),
            'images' => $this->images->map(fn ($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'altText' => $image->alt_text,
            ]),
            'variant' => [
                'name' => $variant?->name,
                'sku' => $variant?->sku,
                'price' => $variant?->price,
                'compareAtPrice' => $variant?->compare_at_price,
                'stockQuantity' => $variant?->stock_quantity ?? 0,
            ],
        ];
    }
}
