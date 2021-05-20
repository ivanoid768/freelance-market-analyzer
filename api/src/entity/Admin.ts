import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from "typeorm";
import { compare, hash } from 'bcrypt'
import { config } from "../config";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Admin {
    @Field(() => ID)
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    @Field(() => String)
    @Column({
        type: 'varchar',
    })
    login: string;

    @Column({
        type: 'varchar',
    })
    password: string;

    @Field(() => String)
    @Column({
        type: 'varchar',
        nullable: true,
    })
    token?: string;

    // @BeforeUpdate() //TODO: check if password is changed
    @BeforeInsert()
    async beforeInsert() {
        console.log('Admin:beforeInsert:password', this.password);
        this.password = await hash(this.password, config.PASSWORD_HASH_SECRET)
    }

    async comparePassword(password: string) {
        const isSame = await compare(password, this.password);
        
        return isSame;
    }

    async setNewPassword(password: string){
        console.log('Admin:setNewPassword:password', this.password);
        this.password = await hash(password, config.PASSWORD_HASH_SECRET)
    }
}