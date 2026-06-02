import { useSyncExternalStore } from 'react';

import type { Product, ProductDetail } from '@/types';

export interface StorefrontItem {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    imageUrl: string | null;
    price: string;
    compareAtPrice: string | null;
    inStock: boolean;
}

export interface CartItem extends StorefrontItem {
    quantity: number;
}

const cartKey = 'bytemart-cart';
const wishlistKey = 'bytemart-wishlist';
const storefrontStorageEvent = 'bytemart-storage';
const emptyItems: [] = [];
const storageCache = new Map<string, { raw: string; items: unknown[] }>();

export function useCart() {
    const items = useStoredItems<CartItem>(cartKey);

    return {
        items,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        subtotal: items.reduce(
            (total, item) => total + Number(item.price) * item.quantity,
            0,
        ),
        addItem: (item: StorefrontItem, quantity = 1) =>
            addCartItem(item, quantity),
        removeItem: (id: number) => removeStoredItem(cartKey, id),
        setQuantity: (id: number, quantity: number) =>
            setCartQuantity(id, quantity),
        clear: () => writeStoredItems(cartKey, []),
    };
}

export function useWishlist() {
    const items = useStoredItems<StorefrontItem>(wishlistKey);

    return {
        items,
        itemCount: items.length,
        hasItem: (id: number) => items.some((item) => item.id === id),
        toggleItem: (item: StorefrontItem) => toggleWishlistItem(item),
        removeItem: (id: number) => removeStoredItem(wishlistKey, id),
        clear: () => writeStoredItems(wishlistKey, []),
    };
}

export function productToStorefrontItem(
    product: Product | ProductDetail,
): StorefrontItem {
    if ('variant' in product) {
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            imageUrl: product.images[0]?.url ?? null,
            price: product.variant.price,
            compareAtPrice: product.variant.compareAtPrice,
            inStock: product.variant.stockQuantity > 0,
        };
    }

    return product;
}

function useStoredItems<T>(key: string): T[] {
    return useSyncExternalStore(
        subscribe,
        () => readStoredItems<T>(key),
        () => emptyItems,
    );
}

function subscribe(callback: () => void) {
    const notify = () => callback();

    window.addEventListener('storage', notify);
    window.addEventListener(storefrontStorageEvent, notify);

    return () => {
        window.removeEventListener('storage', notify);
        window.removeEventListener(storefrontStorageEvent, notify);
    };
}

function readStoredItems<T>(key: string): T[] {
    const raw = window.localStorage.getItem(key) ?? '[]';
    const cached = storageCache.get(key);

    if (cached?.raw === raw) {
        return cached.items as T[];
    }

    try {
        const items = JSON.parse(raw) as T[];

        storageCache.set(key, { raw, items });

        return items;
    } catch {
        return emptyItems;
    }
}

function writeStoredItems<T>(key: string, items: T[]) {
    window.localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event(storefrontStorageEvent));
}

function addCartItem(item: StorefrontItem, quantity: number) {
    const items = readStoredItems<CartItem>(cartKey);
    const existingItem = items.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        items.push({ ...item, quantity });
    }

    writeStoredItems(cartKey, items);
}

function setCartQuantity(id: number, quantity: number) {
    if (quantity < 1) {
        removeStoredItem(cartKey, id);

        return;
    }

    writeStoredItems(
        cartKey,
        readStoredItems<CartItem>(cartKey).map((item) =>
            item.id === id ? { ...item, quantity } : item,
        ),
    );
}

function toggleWishlistItem(item: StorefrontItem) {
    const items = readStoredItems<StorefrontItem>(wishlistKey);
    const exists = items.some((wishlistItem) => wishlistItem.id === item.id);

    writeStoredItems(
        wishlistKey,
        exists
            ? items.filter((wishlistItem) => wishlistItem.id !== item.id)
            : [...items, item],
    );
}

function removeStoredItem(key: string, id: number) {
    writeStoredItems(
        key,
        readStoredItems<StorefrontItem>(key).filter((item) => item.id !== id),
    );
}
