import { User } from "../entity/User";

export enum UserRole {
    TRIAL = 'TRIAL',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM'
}

export interface IContext {
    user: User;
}