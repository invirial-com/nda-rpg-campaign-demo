import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { CharacterInventory } from './character-inventory.entity';

@Entity('characters')
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    class: string;

    @Column()
    race: string;

    @Column({ default: 1 })
    level: number;

    // Attributes
    @Column({ default: 10 })
    strength: number;

    @Column({ default: 10 })
    dexterity: number;

    @Column({ default: 10 })
    constitution: number;

    @Column({ default: 10 })
    intelligence: number;

    @Column({ default: 10 })
    wisdom: number;

    @Column({ default: 10 })
    charisma: number;

    @Column({ type: 'text', nullable: true })
    history: string;

    @Column({ type: 'text', nullable: true })
    skills: string;

    @Column()
    playerId: string;

    @ManyToOne(() => User, (user) => user.characters, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'playerId' })
    player: User;

    @Column({ nullable: true })
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.characters, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @OneToMany(() => CharacterInventory, (inventory) => inventory.character)
    inventory: CharacterInventory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
