import { Field, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";

import { SourceCategory } from "shared/src/entity/SourceCategory";
import { User } from "./User";

@Entity()
@ObjectType()
export class Filter {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Field(() => String)
    @Column({
        length: 300,
    })
    name: string;

    @Field(() => [String])
    @Column({
        type: 'varchar',
        nullable: true,
        transformer: {
            to: (value: string[]) => value.join(','),
            from: (value: string) => value.split(',')
        }
    })
    positiveKeywords: string[];

    @Field(() => [String])
    @Column({
        type: 'varchar',
        nullable: true,
        transformer: {
            to: (value: string[]) => value.join(','),
            from: (value: string) => value.split(',')
        }
    })
    negativeKeywords: string[];

    @Field(() => [SourceCategory])
    @ManyToMany(() => SourceCategory)
    @JoinTable()
    categories: SourceCategory[];

    @ManyToOne(() => User, user => user.filters)
    user: User;
}