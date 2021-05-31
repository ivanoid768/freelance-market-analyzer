import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

export enum PriceType {
    DEAL = 'DEAL',
    ABOUT = 'ABOUT'
    // RANGE = 'RANGE', //TODO: Range price type
}

export enum DifficultyLevel {
    BEGINNER = 'BEGINNER',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum PaymentType {
    HOURLY = 0,
    FIXED = 1,
}

@Entity()
@ObjectType()
export class Task {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    extId: string;

    @Field(() => String)
    @Column({
        length: 100,
    })
    sourceName: string;

    @Column({
        type: 'int',
    })
    sourceId: number;

    // This app id, not id from source!
    @Column({
        type: 'integer',
    })
    categoryId: number;

    @Field(() => String)
    @Index()
    @Column({
        type: 'varchar',
        unique: true,
    })
    url: string;

    @Field(() => String)
    @Column({
        length: 300,
    })
    name: string;

    @Field(() => String)
    @Column({
        type: 'varchar',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        nullable: true,
        transformer: {
            to: (value: string[]) => {
                return value && value.join(',')
            },
            from: (value: string) => {
                return value && value.split(',')
            }
        }
    })
    tags: string[];

    // @Field(() => String)
    @Column({
        type: 'varchar',
    })
    searchText: string;

    @Field(() => String)
    @Column({
        type: 'enum',
        enumName: 'PriceType',
        enum: [PriceType.ABOUT, PriceType.DEAL],
        default: PriceType.ABOUT,
    })
    priceType: string;

    @Field(() => Float)
    @Column({
        type: 'float',
        nullable: true,
    })
    price: number;

    @Field(() => Int)
    @Column({
        type: 'enum',
        nullable: true,
        enum: [PaymentType.HOURLY, PaymentType.FIXED]
    })
    paymentType: number;

    @Field(() => Int)
    @Column({
        type: 'enum',
        nullable: true,
        enum: [DifficultyLevel.BEGINNER, DifficultyLevel.MEDIUM, DifficultyLevel.HIGH]
    })
    difficultyLevel: number;

    @Field(() => Int)
    @Column({
        type: 'int',
        nullable: true,
    })
    bidCount: number;

    @Field(() => Float)
    @Column({
        type: 'int',
        nullable: true,
    })
    customerRating: number;

    @Column({
        type: 'timestamp',
        default: Date.now()
    })
    created: number;
}
