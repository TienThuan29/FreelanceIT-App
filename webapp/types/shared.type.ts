export type BaseTimestamps = {
  createdDate?: Date;
  updatedDate?: Date;
};

export enum ProjectStatus {
  DRAFT = "DRAFT",
  OPEN_APPLYING = "OPEN_APPLYING",
  CLOSED_APPLYING = "CLOSED_APPLYING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED"
}

export enum NotificationType {
  SYSTEM = "SYSTEM",
  PROJECT = "PROJECT",
  APPLICATION = "APPLICATION"
}

