import type { BaseTimestamps } from "./shared.type";
import type { NotificationType } from "./shared.type";

export type Notification = BaseTimestamps & {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content?: string;
  relatedEntityId?: string;
  isRead: boolean;
  readDate?: Date;
  isDeleted: boolean;
};
