import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { SourceCategory } from "./SourceCategory";
import { User } from "./User";

@Entity()
export class Filter {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Column({
        length: 300,
    })
    name: string;

    @Column({
        type: 'varchar',
        nullable: true,
        transformer: {
            to: (value: string[]) => value.join(','),
            from: (value: string) => value.split(',')
        }
    })
    positiveKeywords: string[];

    @Column({
        type: 'varchar',
        nullable: true,
        transformer: {
            to: (value: string[]) => value.join(','),
            from: (value: string) => value.split(',')
        }
    })
    negativeKeywords: string[];

    @ManyToMany(() => SourceCategory)
    @JoinTable()
    categories: SourceCategory[];

    @ManyToOne(() => User, user => user.filters)
    user: User;
}
