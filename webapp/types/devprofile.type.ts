import type { DeveloperLevel } from "./shared.type";
import type { UserProfile } from "./userprofile.type";

export type DeveloperProfile = UserProfile & {
  title?: string;
  bio?: string;
  hourlyRate?: number;
  experienceYears?: number;
  developerLevel?: DeveloperLevel;
  githubUrl?: string;
  linkedinUrl?: string;
  isAvailable?: boolean;
  rating?: number;
  totalProjects?: number;
  languages?: string[];
  timezone?: string;
  skills?: string[];
  cvUrl?: string;
};

export type CustomerProfile = UserProfile & {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  taxId?: string;
  address?: string;
  city?: string;
  state?: string;
  countryName?: string;
  rating?: number;
  totalProjectsPosted?: number;
};
