<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $brands = collect([
            ['name' => 'Pulse Audio', 'slug' => 'pulse-audio'],
            ['name' => 'Nova Tech', 'slug' => 'nova-tech'],
            ['name' => 'StreetStep', 'slug' => 'streetstep'],
            ['name' => 'Nordic Home', 'slug' => 'nordic-home'],
            ['name' => 'Glow Care', 'slug' => 'glow-care'],
            ['name' => 'FlexFit', 'slug' => 'flexfit'],
            ['name' => 'Brew House', 'slug' => 'brew-house'],
            ['name' => 'Green Basket', 'slug' => 'green-basket'],
        ])->mapWithKeys(function (array $brand) {
            $model = Brand::query()->updateOrCreate(['slug' => $brand['slug']], $brand);

            return [$brand['slug'] => $model];
        });

        $categories = collect([
            ['name' => 'Electronics', 'slug' => 'electronics', 'image_url' => 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'image_url' => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500&q=80'],
            ['name' => 'Beauty', 'slug' => 'beauty', 'image_url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80'],
            ['name' => 'Sports', 'slug' => 'sports', 'image_url' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80'],
            ['name' => 'Groceries', 'slug' => 'groceries', 'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'],
        ])->mapWithKeys(function (array $category, int $index) {
            $model = Category::query()->create([...$category, 'sort_order' => $index + 1]);

            return [$category['slug'] => $model];
        });

        $products = [
            ['brand' => 'pulse-audio', 'category' => 'electronics', 'name' => 'Pulse Wireless Headphones', 'slug' => 'pulse-wireless-headphones', 'sku' => 'ELEC-HEAD-001', 'price' => 3499, 'compare' => 4499, 'stock' => 24, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'nova-tech', 'category' => 'electronics', 'name' => 'Nova Smart Watch', 'slug' => 'nova-smart-watch', 'sku' => 'ELEC-WATCH-001', 'price' => 5899, 'compare' => 6999, 'stock' => 18, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'streetstep', 'category' => 'fashion', 'name' => 'Everyday Canvas Sneakers', 'slug' => 'everyday-canvas-sneakers', 'sku' => 'FASH-SHOE-001', 'price' => 2299, 'compare' => 2899, 'stock' => 31, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'nordic-home', 'category' => 'home-living', 'name' => 'Nordic Table Lamp', 'slug' => 'nordic-table-lamp', 'sku' => 'HOME-LAMP-001', 'price' => 1899, 'compare' => null, 'stock' => 16, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'glow-care', 'category' => 'beauty', 'name' => 'Glow Daily Skincare Set', 'slug' => 'glow-daily-skincare-set', 'sku' => 'BEAU-SKIN-001', 'price' => 2699, 'compare' => 3199, 'stock' => 27, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'flexfit', 'category' => 'sports', 'name' => 'Flex Yoga Essentials Kit', 'slug' => 'flex-yoga-essentials-kit', 'sku' => 'SPRT-YOGA-001', 'price' => 1999, 'compare' => 2499, 'stock' => 22, 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'brew-house', 'category' => 'home-living', 'name' => 'Brew Ceramic Mug Set', 'slug' => 'brew-ceramic-mug-set', 'sku' => 'HOME-MUG-001', 'price' => 1299, 'compare' => 1599, 'stock' => 38, 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85'],
            ['brand' => 'green-basket', 'category' => 'groceries', 'name' => 'Organic Pantry Basket', 'slug' => 'organic-pantry-basket', 'sku' => 'GROC-BASK-001', 'price' => 1599, 'compare' => 1899, 'stock' => 12, 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85'],
        ];

        foreach ($products as $item) {
            $wishlistCount = $item['featured'] ? rand(30, 60) : rand(5, 25);
            $cartCount = $item['featured'] ? rand(15, 35) : rand(2, 12);

            $product = Product::query()->create([
                'brand_id' => $brands[$item['brand']]->id,
                'name' => $item['name'],
                'slug' => $item['slug'],
                'short_description' => 'A dependable ByteMart pick made for comfortable everyday use.',
                'description' => 'Selected for quality, practicality, and lasting value, this product is a reliable addition to your daily routine. It is carefully packed and supported by ByteMart customer care for a straightforward shopping experience.',
                'is_featured' => $item['featured'],
                'wishlist_count' => $wishlistCount,
                'cart_count' => $cartCount,
            ]);

            $product->categories()->attach($categories[$item['category']]);
            $product->variants()->create([
                'sku' => $item['sku'],
                'price' => $item['price'],
                'compare_at_price' => $item['compare'],
                'stock_quantity' => $item['stock'],
                'is_default' => true,
            ]);
            $product->images()->create([
                'url' => $item['image'],
                'alt_text' => $item['name'],
                'is_primary' => true,
            ]);
            $product->reviews()->create([
                'name' => 'Aarav Sharma',
                'email' => 'aarav@example.com',
                'rating' => $item['featured'] ? 5 : 4,
                'comment' => 'Good quality product and a smooth delivery experience. The item matched the description.',
            ]);
        }

        // Seed mock orders for analytics
        $allProducts = Product::with(['variants', 'images'])->get();
        if ($allProducts->count() >= 5) {
            $customers = [
                ['name' => 'Sita Thapa', 'email' => 'sita@example.com', 'phone' => '9841234567', 'city' => 'Kathmandu', 'address' => 'Balaju'],
                ['name' => 'Ram Shrestha', 'email' => 'ram@example.com', 'phone' => '9851098765', 'city' => 'Lalitpur', 'address' => 'Patan'],
                ['name' => 'Hari Prasad', 'email' => 'hari@example.com', 'phone' => '9803112233', 'city' => 'Pokhara', 'address' => 'Lakeside'],
                ['name' => 'Gita Sharma', 'email' => 'gita@example.com', 'phone' => '9812345678', 'city' => 'Bhaktapur', 'address' => 'Suryabinayak'],
                ['name' => 'Ramesh Chaudhary', 'email' => 'ramesh@example.com', 'phone' => '9865432109', 'city' => 'Kathmandu', 'address' => 'Koteshwor']
            ];

            // Define order items combinations
            // Order 1: 2x Pulse Wireless Headphones (0), 1x Everyday Canvas Sneakers (2)
            // Order 2: 1x Nova Smart Watch (1), 3x Brew Ceramic Mug Set (6)
            // Order 3: 2x Everyday Canvas Sneakers (2), 1x Glow Daily Skincare Set (4)
            // Order 4: 1x Nordic Table Lamp (3)
            // Order 5: 1x Pulse Wireless Headphones (0)
            $orderItemsMapping = [
                0 => [[0, 2], [2, 1]],
                1 => [[1, 1], [6, 3]],
                2 => [[2, 2], [4, 1]],
                3 => [[3, 1]],
                4 => [[0, 1]]
            ];

            foreach ($customers as $index => $cust) {
                $itemsData = [];
                $subtotal = 0;

                foreach ($orderItemsMapping[$index] as $mapping) {
                    $prodIndex = $mapping[0];
                    $qty = $mapping[1];

                    if (isset($allProducts[$prodIndex])) {
                        $prod = $allProducts[$prodIndex];
                        $variant = $prod->variants->first();
                        $price = $variant ? $variant->price : 1000;
                        $lineTotal = $price * $qty;

                        $itemsData[] = [
                            'product_id' => $prod->id,
                            'product_name' => $prod->name,
                            'sku' => $variant ? $variant->sku : null,
                            'image_url' => $prod->images->first()?->url,
                            'unit_price' => $price,
                            'quantity' => $qty,
                            'line_total' => $lineTotal
                        ];
                        $subtotal += $lineTotal;
                    }
                }

                $deliveryFee = $subtotal >= 2500 ? 0 : 100;
                $order = \App\Models\Order::create([
                    'reference' => 'BM-' . \Illuminate\Support\Str::upper(\Illuminate\Support\Str::random(8)),
                    'user_id' => null,
                    'customer_name' => $cust['name'],
                    'email' => $cust['email'],
                    'phone' => $cust['phone'],
                    'address' => $cust['address'],
                    'city' => $cust['city'],
                    'delivery_method' => $cust['city'] === 'Kathmandu' ? 'kathmandu' : 'outside',
                    'payment_method' => 'cod',
                    'status' => 'received',
                    'subtotal' => $subtotal,
                    'delivery_fee' => $deliveryFee,
                    'total' => $subtotal + $deliveryFee,
                    'created_at' => now()->subDays(5 - $index),
                    'updated_at' => now()->subDays(5 - $index),
                ]);

                foreach ($itemsData as $itemData) {
                    $order->items()->create($itemData);
                }
            }
        }
    }
}
