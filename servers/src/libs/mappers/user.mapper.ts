import { User } from "@/models/user.model";
import { UserProfileResponse } from "@/types/res/user.res";

export const mapUserToUserProfileResponse = async (user: User): Promise<UserProfileResponse> => {
    return {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isEnable: user.isEnable,
        lastLoginDate: user.lastLoginDate,
        createdDate: user.createdDate,
        updatedDate: user.updatedDate,
    } as UserProfileResponse;
}