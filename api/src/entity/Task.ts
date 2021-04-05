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

@Entity()
export class Task {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

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

    @Index()
    @Column({
        type: 'varchar',
        unique: true,
    })
    url: string;

    @Column({
        length: 300,
    })
    name: string;

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
                return value.join(',')
            },
            from: (value: string) => {
                return value.split(',')
            }
        }
    })
    tags: string[];

    @Column({
        type: 'varchar',
    })
    searchText: string;

    @Column({
        type: 'enum',
        enumName: 'PriceType',
        enum: [PriceType.ABOUT, PriceType.DEAL],
        default: PriceType.ABOUT,
    })
    priceType: string;

    @Column({
        type: 'float',
        nullable: true,
    })
    price: number;

    @Column({
        type: 'enum',
        nullable: true,
        enum: [DifficultyLevel.BEGINNER, DifficultyLevel.MEDIUM, DifficultyLevel.HIGH]
    })
    difficultyLevel: number;

    @Column({
        type: 'int',
        nullable: true,
    })
    bidCount: number;

    @Column({
        type: 'int',
        nullable: true,
    })
    customerRating: number;
}
