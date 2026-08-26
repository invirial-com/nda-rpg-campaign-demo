import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    type: string;

    @Column()
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.media, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @CreateDateColumn()
    createdAt: Date;
}
