export interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
    productCount?: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    imageUrl: string | null;
    price: string;
    compareAtPrice: string | null;
    inStock: boolean;
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    shortDescription: string | null;
    longDescription: string | null;
    brand: string | null;
    brandSlug: string | null;
    category: string | null;
    categorySlug: string | null;
    rating: {
        average: number;
        count: number;
    };
    reviews: Array<{
        id: number;
        name: string;
        rating: number;
        comment: string;
        createdAt: string;
    }>;
    images: Array<{
        id: number;
        url: string;
        altText: string | null;
    }>;
    variant: {
        name: string | null;
        sku: string | null;
        price: string;
        compareAtPrice: string | null;
        stockQuantity: number;
    };
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}
