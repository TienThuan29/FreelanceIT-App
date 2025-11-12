export type Rating = {
    id: string;
    userId: string;
    stars: number; // 1-5
    comment: string;
    createdDate: Date;
    updatedDate: Date;
}