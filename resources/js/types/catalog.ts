export interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    imageUrl: string | null;
    price: string;
    compareAtPrice: string | null;
    inStock: boolean;
}
