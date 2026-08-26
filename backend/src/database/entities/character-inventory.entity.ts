import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from './character.entity';
import { Item } from './item.entity';

@Entity('character_inventory')
export class CharacterInventory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    characterId: string;

    @ManyToOne(() => Character, (character) => character.inventory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'characterId' })
    character: Character;

    @Column()
    itemId: string;

    @ManyToOne(() => Item, (item) => item.inventoryEntries, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ default: 1 })
    quantity: number;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
