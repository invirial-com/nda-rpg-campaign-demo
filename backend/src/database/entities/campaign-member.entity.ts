import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}

@Entity('campaign_members')
export class CampaignMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    campaignId: string;

    @ManyToOne(() => Campaign, (campaign) => campaign.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaignId' })
    campaign: Campaign;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    email: string; // For pending invitations where user might not exist yet or just by email

    @Column({
        type: 'enum',
        enum: InvitationStatus,
        default: InvitationStatus.PENDING,
    })
    status: InvitationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
