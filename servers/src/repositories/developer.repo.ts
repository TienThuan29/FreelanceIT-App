import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { DeveloperProfile } from "@/models/user.model";

export class DeveloperRepository extends DynamoRepository {
    
    constructor() {
        super(config.DEVELOPER_PROFILE_TABLE);
    }

    public async findByUserId(userId: string): Promise<DeveloperProfile | null> {
        const developerProfile = await this.getItem({ userId });
        if (!developerProfile) {
            return null;
        }
        return developerProfile as DeveloperProfile;
    }

}