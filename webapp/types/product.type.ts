
export type Product = {
    id: string;
    developerId: string;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    status: ProductStatus;
    views?: number;
    downloads?: number;
    likes?: number;
    sellOnlyOne?: boolean;
    reviews?: ProductReview[];
    createdDate?: Date;
    updatedDate?: Date;
};

export type ProductReview = {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdDate?: Date;
    updatedDate?: Date;
};

export enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED",
    SOLD = "SOLD",
}