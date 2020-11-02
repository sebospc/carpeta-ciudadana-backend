import { Entity, Column, OneToMany, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { Item } from '../base';

@Entity()
export class Citizen extends Item {

    @Column()
    identifier: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({
        nullable: true
    })
    address: string;

    @OneToMany(type => DocumentContainer, documentContainer => documentContainer.citizen, {
        cascade: true,
        eager: false
    })
    @JoinColumn()
    documentContainers: DocumentContainer[];

}

@Entity({ schema: 'media' })
export class Media {

    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    updatedAt: Date;

}

@Entity()
export class Document extends Media {

    @Column({
        type: 'bytea',
        nullable: false
    })
    file: Buffer;

}

@Entity()
export class DocumentContainer extends Media {
    @Column({
        nullable: false
    })
    fileName: string;

    @Column({
        nullable: false
    })
    mimeType: string;

    @ManyToOne(type => Citizen, textileReference => textileReference.documentContainers)
    citizen: Citizen;

    @OneToOne(type => Document, {
        cascade: true,
        eager: false
    })
    @JoinColumn()
    document: Document;
}


