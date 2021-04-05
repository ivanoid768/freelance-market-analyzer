import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class Source {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Index()
    @Column({
        type: 'varchar',
    })
    baseUrl: string;

    @Column({
        length: 100,
    })
    name: string;
}