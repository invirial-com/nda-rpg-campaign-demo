import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('npcs')
export class Npc {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    role: string;

    @Column({ type: 'jsonb', nullable: true })
    attributes: any;

    @Column({ type: 'text', nullable: true })
    relationships: string;

    @Column()
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.npcs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
