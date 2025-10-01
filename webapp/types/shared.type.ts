export enum Role {
  DEVELOPER = "DEVELOPER",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM"
}

export type BaseTimestamps = {
  createdDate?: Date;
  updatedDate?: Date;
};

export type NotificationType = "System" | "Project" | "Message" | "Application";
export type DeveloperLevel = "Junior" | "Mid" | "Senior" | "Lead";
export type SkillProficiency = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type ProjectType = "FixedPrice" | "Hourly" | "Milestone";
export type BudgetType = "Fixed" | "Range" | "Hourly";
export type ProjectStatus = "Draft" | "Open" | "InProgress" | "Completed" | "Cancelled";
export type ApplicationStatus = "Submitted" | "Reviewed" | "Shortlisted" | "Rejected" | "Accepted";
export type InvitationStatus = "Pending" | "Accepted" | "Declined";

