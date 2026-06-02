<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('admin/orders/index', [
            'orders' => Order::withCount('items')
                ->when($search, fn ($query) => $query
                    ->where('reference', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%"))
                ->latest()
                ->paginate(20)
                ->withQueryString()
                ->through(fn (Order $order) => [
                    'id' => $order->id,
                    'reference' => $order->reference,
                    'customerName' => $order->customer_name,
                    'email' => $order->email,
                    'phone' => $order->phone,
                    'deliveryAddress' => "{$order->address}, {$order->city}",
                    'paymentMethod' => $order->payment_method,
                    'status' => $order->status,
                    'itemsCount' => $order->items_count,
                    'total' => $order->total,
                    'createdAt' => $order->created_at->toDateTimeString(),
                ]),
            'filters' => ['search' => $search],
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['received', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])],
        ]);

        DB::transaction(function () use ($data, $order) {
            if ($order->status !== 'cancelled' && $data['status'] === 'cancelled') {
                foreach ($order->items as $item) {
                    ProductVariant::where('product_id', $item->product_id)
                        ->where('is_default', true)
                        ->increment('stock_quantity', $item->quantity);
                }
            }

            if ($order->status === 'cancelled' && $data['status'] !== 'cancelled') {
                foreach ($order->items as $item) {
                    $variant = ProductVariant::where('product_id', $item->product_id)
                        ->where('is_default', true)
                        ->lockForUpdate()
                        ->first();

                    if (! $variant || $variant->stock_quantity < $item->quantity) {
                        throw ValidationException::withMessages([
                            'status' => "Not enough stock is available to reopen order {$order->reference}.",
                        ]);
                    }

                    $variant->decrement('stock_quantity', $item->quantity);
                }
            }

            $order->update($data);
        });
        ActivityLogger::log($request, 'order.status_updated', "Changed order {$order->reference} status to {$order->status}.", $order);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order status updated successfully.']);

        return back();
    }
}
