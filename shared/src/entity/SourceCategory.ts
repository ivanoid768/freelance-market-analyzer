import { Field, ID, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
@Index(['sourceId', 'rootCategoryId'])
@ObjectType()
export class SourceCategory {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Index()
    @Column({
        type: 'integer'
    })
    sourceId: number;

    @Column({
        length: 100,
    })
    sourceName: string;

    @Field(() => Int)
    @Index()
    @Column({
        type: 'integer',
        nullable: true,
    })
    rootCategoryId: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    extId: string;
    
    @Field(() => String)
    @Column({
        type: 'varchar',
    })
    path: string;

    @Column()
    searchText: string;
}