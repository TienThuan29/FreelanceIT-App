import type { BaseTimestamps, SkillProficiency } from "./shared.type";

export type Skill = BaseTimestamps & {
  id: string;
  name: string;
  category?: string;
};

export type DeveloperSkill = BaseTimestamps & {
  id: string;
  developerId: string;
  skillId: string;
  proficiency: SkillProficiency;
  yearsOfExperience: number;
};
