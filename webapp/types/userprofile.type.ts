import type { BaseTimestamps, NotificationType } from "./shared.type";
import { Role } from "./shared.type";

export type UserProfile = BaseTimestamps & {
  id: string;
  email: string;
  password: string;
  avatarUrl?: string;
  fullname: string;
  phone?: string;
  dateOfBirth?: Date;
  role: Role;
  isEnable: boolean;
  lastLoginDate?: Date;
};

export type Notification = BaseTimestamps & {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content?: string;
  relatedEntityId?: string;
  isRead: boolean;
  readDate?: Date;
};
