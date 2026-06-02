<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data, $request) {
            $items = collect($data['items'])->map(function (array $item) {
                $product = Product::with(['images', 'variants' => fn ($query) => $query->where('is_default', true)])
                    ->active()
                    ->lockForUpdate()
                    ->findOrFail($item['id']);
                $variant = $product->variants->firstOrFail();

                if ($variant->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Only {$variant->stock_quantity} units of {$product->name} are available.",
                    ]);
                }

                $variant->decrement('stock_quantity', $item['quantity']);

                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $variant->sku,
                    'image_url' => $product->images->first()?->url,
                    'unit_price' => $variant->price,
                    'quantity' => $item['quantity'],
                    'line_total' => round((float) $variant->price * $item['quantity'], 2),
                ];
            });
            $subtotal = $items->sum(fn (array $item) => (float) $item['line_total']);
            $deliveryFee = $data['delivery'] === 'kathmandu' && $subtotal >= 2500
                ? 0
                : ($data['delivery'] === 'kathmandu' ? 100 : 200);

            $order = Order::create([
                'reference' => 'BM-'.Str::upper(Str::random(8)),
                'user_id' => $request->user()?->id,
                'customer_name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'city' => $data['city'],
                'notes' => $data['notes'] ?? null,
                'delivery_method' => $data['delivery'],
                'payment_method' => $data['payment'],
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total' => $subtotal + $deliveryFee,
            ]);
            $order->items()->createMany($items);

            return $order->load('items');
        });

        return response()->json([
            'order' => [
                'reference' => $order->reference,
                'createdAt' => $order->created_at->toISOString(),
                'status' => 'Order received',
                'customerName' => $order->customer_name,
                'deliveryAddress' => "{$order->address}, {$order->city}",
                'deliveryLabel' => $order->delivery_method === 'kathmandu' ? 'Kathmandu Valley' : 'Outside Kathmandu Valley',
                'paymentLabel' => 'Cash on delivery',
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->product_id,
                    'name' => $item->product_name,
                    'slug' => '',
                    'category' => null,
                    'imageUrl' => $item->image_url,
                    'price' => $item->unit_price,
                    'compareAtPrice' => null,
                    'inStock' => true,
                    'quantity' => $item->quantity,
                ]),
                'subtotal' => (float) $order->subtotal,
                'deliveryFee' => (float) $order->delivery_fee,
                'total' => (float) $order->total,
            ],
        ], 201);
    }
}
