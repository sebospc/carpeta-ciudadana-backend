import { Entity, Column, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Media } from '../base';

import { Item } from '../base/Item.entity';

@Entity()
export class Cityzen extends Item {

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

    @OneToMany(type => DocumentContainer, documentContainer => documentContainer.cityzen, {
        cascade: true,
        eager: false
    })
    @JoinColumn()
    documentContainers: DocumentContainer[];

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

    @ManyToOne(type => Cityzen, textileReference => textileReference.documentContainers)
    cityzen: Cityzen;

    @OneToOne(type => Document, {
        cascade: true,
        eager: false
    })
    @JoinColumn()
    document: Document;
}


