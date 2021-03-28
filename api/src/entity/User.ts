import { Entity, Column, PrimaryGeneratedColumn, getRepository } from "typeorm";

export enum UserRole {
    TRIAL = 'TRIAL',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Column({
        length: 50,
    })
    uuid!: string;

    @Column({
        default: false,
    })
    isActive!: boolean;

    @Column({
        type: 'enum',
        enum: [UserRole.TRIAL, UserRole.STANDARD, UserRole.PREMIUM],
    })
    role!: string;

    @Column({
        nullable: true,
    })
    token?: string;
}
