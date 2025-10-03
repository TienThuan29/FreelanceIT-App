export type Notification = {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    content?: string;
    relatedEntityId?: string;
    isRead: boolean;
    readDate?: Date;
    isDeleted: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}

export enum NotificationType {
    SYSTEM = "SYSTEM",
    PROJECT = "PROJECT",
    APPLICATION = "APPLICATION"
}