import { AuthChecker } from "type-graphql";

import { User } from "../entity/User";
import { UserRole } from "./types.api";
import { Admin } from "../entity/Admin";

interface IContext {
    user: User;
}

enum Common {
    Admin = 'ADMIN',
}

export const Role = { Common, UserRole }
export type Role = typeof Role;

export const customAuthChecker: AuthChecker<IContext> = (
    { root, args, context, info },
    roles,
) => {
    if (context?.user?.role && roles.indexOf(context.user.role) !== -1) {
        return true;
    }

    if (context?.user && context.user instanceof Admin) {
        return true;
    }

    return false;
};