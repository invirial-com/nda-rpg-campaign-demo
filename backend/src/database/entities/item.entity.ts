import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CharacterInventory } from './character-inventory.entity';

export enum ItemType {
    WEAPON = 'weapon',
    ARMOR = 'armor',
    CONSUMABLE = 'consumable',
    ARTIFACT = 'artifact',
    MISC = 'misc',
}

export enum ItemRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    VERY_RARE = 'very_rare',
    LEGENDARY = 'legendary',
}

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ItemType,
        default: ItemType.MISC,
    })
    type: ItemType;

    @Column({
        type: 'enum',
        enum: ItemRarity,
        default: ItemRarity.COMMON,
    })
    rarity: ItemRarity;

    @Column({ type: 'jsonb', nullable: true })
    properties: any;

    @Column()
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @OneToMany(() => CharacterInventory, (inventory) => inventory.item)
    inventoryEntries: CharacterInventory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
