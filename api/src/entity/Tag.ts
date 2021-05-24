import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Tag {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Field(() => String)
    @Column({
        type: "varchar"
    })
    name!: string;
}