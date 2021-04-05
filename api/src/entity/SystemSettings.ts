import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SystemSettings {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id!: number;

    
}
