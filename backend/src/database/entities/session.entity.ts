import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('sessions')
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'text', nullable: true })
    summary: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'text', nullable: true })
    milestones: string;

    @Column()
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
