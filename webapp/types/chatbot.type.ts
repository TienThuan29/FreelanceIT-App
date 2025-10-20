export type ChatbotSession = {
    sessionId: string;
    userId: string;
    title?: string;
    description?: string;
    chatItems?: ChatItem[]
    isDeleted?: boolean;
    createdDate?: Date;
    updatedDate?: Date;
}

export type ChatItem = {
    content: string;
    isBot: boolean;
    createdDate: string;
    // Optional fields for structured bot responses
    fullAnswer?: string;
    devIds?: string[];
    developerProfiles?: DeveloperProfileResponse[];
}

export type ChatbotMessageResponse = {
    fullAnswer: string;
    devIds: string[];
    developerProfiles?: DeveloperProfileResponse[];
}

export type DeveloperProfileResponse = {
    userId: string;
    title?: string;
    bio?: string;
    hourlyRate?: number;
    experienceYears?: number;
    developerLevel?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    isAvailable?: boolean;
    rating?: number;
    skills?: Array<{id: string; name: string; proficiency: string; yearsOfExperience: number}>;
    totalProjects?: number;
    languages?: string[];
    timezone?: string;
    cvUrl?: string;
    createdDate?: string;
    updatedDate?: string;
}