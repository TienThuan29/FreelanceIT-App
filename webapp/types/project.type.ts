import type {
  BaseTimestamps,
  ProjectStatus,
  ApplicationStatus
} from "./shared.type";

export type Project = BaseTimestamps & {
  id: string;
  customerId: string;
  title: string;
  description?: string;
  category?: string;
  requiredSkills?: string[];
  projectType: ProjectType;
  budget?: number;
  minBudget?: number;
  maxBudget?: number;
  estimateDuration?: number;
  startDate?: Date;
  endDate?: Date;
  status: ProjectStatus;
  isRemote?: boolean;
  location?: string;
  attachments?: string[];
  views?: number;
};

export type ProjectType = {
  id: string;
  name: string;
  isDeleted: boolean;
  createdDate?: Date;
  updatedDate?: Date;
}

export type ProjectApplication = BaseTimestamps & {
  id: string;
  projectId: string;
  developerId: string;
  coverLetter?: string;
  expectedRate?: number;
  deliveryTime?: number;
  rating?: number;
  status: ApplicationStatus;
  appliedDate?: Date;
  reviewedDate?: Date;
  notes?: string;
};

export type ProjectTeam = BaseTimestamps & {
  id: string;
  projectId: string;
  developerId: string;
  joinedDate?: Date;
  leftDate?: Date;
  isActive: boolean;
  agreedRate?: number;
  contractUrl?: string;
};
