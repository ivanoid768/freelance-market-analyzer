import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
@Index(['sourceId', 'rootCategoryId'])
export class SourceCategory {
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
    
    @Column({
        type: 'varchar',
    })
    path: string;

    @Column()
    searchText: string;
}