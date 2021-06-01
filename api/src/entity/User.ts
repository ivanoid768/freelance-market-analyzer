import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Filter } from "./Filter";
import { UserRole } from "../api/types.api";

@Entity()
@ObjectType()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Field(() => String)
    @Column({
        length: 50,
    })
    uuid!: string;

    @Field(() => Boolean)
    @Column({
        default: false,
    })
    isActive!: boolean;

    @Field(() => String)
    @Column({
        type: 'enum',
        enum: [UserRole.TRIAL, UserRole.STANDARD, UserRole.PREMIUM],
    })
    role!: string;

    @Field(() => String)
    @Column({
        nullable: true,
    })
    token?: string;

    @Field(() => String)
    @Column({
        type: 'varchar', //TODO: validate email. unique!
        default: 'username@mail.com' 
    })
    email: string;

    @OneToMany(() => Filter, filter => filter.user)
    filters: Filter[];
}
