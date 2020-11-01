import { Item } from "../base";
import { Column, Entity } from 'typeorm';

@Entity()
export class Organization extends Item {
    
    @Column()
    identifier: string;

    @Column()
    secretKey: string;
}