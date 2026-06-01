<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $variant = $this->variants->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->categories->first()?->name,
            'imageUrl' => $this->images->first()?->url,
            'price' => $variant?->price,
            'compareAtPrice' => $variant?->compare_at_price,
            'inStock' => ($variant?->stock_quantity ?? 0) > 0,
        ];
    }
}
