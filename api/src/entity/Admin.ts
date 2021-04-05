import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from "typeorm";
import { compare, hash } from 'bcrypt'
import { config } from "../config";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Column({
        type: 'varchar',
    })
    login: string;

    @Column({
        type: 'varchar',
    })
    password: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    token?: string;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeInsert() {
        console.log('Adim:BeforeUpdate:password', this.password);
        this.password = await hash(this.password, config.PASSWORD_HASH_SECRET)
    }

    async comparePassword(password: string) {
        const isSame = await compare(password, this.password);
        
        return isSame;
    }
}