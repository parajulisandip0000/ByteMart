<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'name', 'sku', 'price', 'compare_at_price', 'stock_quantity', 'attributes', 'is_default'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'compare_at_price' => 'decimal:2', 'attributes' => 'array', 'is_default' => 'boolean'];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
