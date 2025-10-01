import { useMemo } from 'react';
import { UserProfile } from '@/types/user.type';
import { Constant } from '@/configs/constant';

export const validateUserRole = (user: UserProfile | null) => {
    if (!user) {
    return {
        isSystem: false,
        isDeveloper: false,
        isCustomer: false,
        isAdmin: false,
        hasRole: (role: string) => false,
        getUserRole: () => null
    };
    }

    const isSystem = user.role === Constant.ROLES.SYSTEM;
    const isDeveloper = user.role === Constant.ROLES.DEVELOPER;
    const isCustomer = user.role === Constant.ROLES.CUSTOMER;
    const isAdmin = user.role === Constant.ROLES.ADMIN;


    return {
        isSystem,
        isDeveloper,
        isCustomer,
        isAdmin,
        hasRole: (role: string) => role === user.role,
        getUserRole: () => user.role
    };
};


export const useRoleValidator = (user: UserProfile | null) => {
    return useMemo(() => validateUserRole(user), [user]);
};
