<?php

namespace Tests\Feature\Storefront;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_checkout_creates_order_using_server_prices_and_reduces_stock(): void
    {
        $product = Product::create([
            'name' => 'Desk Speaker',
            'slug' => 'desk-speaker',
            'short_description' => 'Compact audio.',
            'description' => 'Compact audio for a work desk.',
            'is_active' => true,
        ]);
        $variant = $product->variants()->create([
            'sku' => 'BM-SPEAKER-01',
            'price' => 1500,
            'stock_quantity' => 5,
            'is_default' => true,
        ]);

        $response = $this->postJson(route('checkout.orders.store'), [
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone' => '9800000000',
            'address' => 'New Road',
            'city' => 'Kathmandu',
            'delivery' => 'kathmandu',
            'payment' => 'cod',
            'items' => [
                ['id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('order.subtotal', 3000)
            ->assertJsonPath('order.deliveryFee', 0)
            ->assertJsonPath('order.total', 3000);

        $this->assertDatabaseHas('orders', [
            'email' => 'customer@example.com',
            'subtotal' => 3000,
            'total' => 3000,
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'order.placed',
            'actor_type' => 'guest',
            'actor_email' => 'customer@example.com',
        ]);
        $this->assertSame(3, $variant->fresh()->stock_quantity);
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->admin()->create();
        $order = Order::create([
            'reference' => 'BM-TEST0001',
            'customer_name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone' => '9800000000',
            'address' => 'New Road',
            'city' => 'Kathmandu',
            'delivery_method' => 'kathmandu',
            'payment_method' => 'cod',
            'subtotal' => 1000,
            'delivery_fee' => 100,
            'total' => 1100,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), ['status' => 'confirmed'])
            ->assertRedirect();

        $this->assertSame('confirmed', $order->fresh()->status);
        $this->assertDatabaseHas('activity_logs', ['action' => 'order.status_updated']);
    }

    public function test_cancelling_and_reopening_order_keeps_stock_in_sync(): void
    {
        $admin = User::factory()->admin()->create();
        $product = Product::create([
            'name' => 'Desk Speaker',
            'slug' => 'desk-speaker',
            'short_description' => 'Compact audio.',
            'description' => 'Compact audio for a work desk.',
            'is_active' => true,
        ]);
        $variant = $product->variants()->create([
            'sku' => 'BM-SPEAKER-01',
            'price' => 1500,
            'stock_quantity' => 3,
            'is_default' => true,
        ]);
        $order = Order::create([
            'reference' => 'BM-TEST0002',
            'customer_name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone' => '9800000000',
            'address' => 'New Road',
            'city' => 'Kathmandu',
            'delivery_method' => 'kathmandu',
            'payment_method' => 'cod',
            'subtotal' => 3000,
            'delivery_fee' => 0,
            'total' => 3000,
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'sku' => $variant->sku,
            'unit_price' => 1500,
            'quantity' => 2,
            'line_total' => 3000,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), ['status' => 'cancelled'])
            ->assertRedirect();
        $this->assertSame(5, $variant->fresh()->stock_quantity);

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), ['status' => 'processing'])
            ->assertRedirect();
        $this->assertSame(3, $variant->fresh()->stock_quantity);
    }
}
