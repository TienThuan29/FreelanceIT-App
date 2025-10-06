import { DeveloperRepository } from "@/repositories/developer.repo";
import { UserRepository } from "@/repositories/user.repo";
import { DeveloperProfileResponse } from "@/types";

export class DeveloperService {

    private readonly developerRepository: DeveloperRepository;  
    private readonly userRepository: UserRepository;
    
    constructor() {
        this.developerRepository = new DeveloperRepository();
        this.userRepository = new UserRepository();
    }

    public async getDeveloperProfile(userId: string): Promise<DeveloperProfileResponse | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const developerProfile = await this.developerRepository.findByUserId(userId);
        if (!developerProfile) {
            return null;
        }
        return {
            userProfile: user,
            developerProfile: developerProfile,
        } as DeveloperProfileResponse;
    }

}