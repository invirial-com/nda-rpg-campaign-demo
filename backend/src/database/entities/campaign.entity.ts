import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Character } from './character.entity';
import { Npc } from './npc.entity';
import { Item } from './item.entity';
import { Session } from './session.entity';
import { Media } from './media.entity';
import { CampaignMember } from './campaign-member.entity';

export enum CampaignStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}

@Entity('campaigns')
export class Campaign {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    inviteCode: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    setting: string;

    @Column({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.ACTIVE,
    })
    status: CampaignStatus;

    @Column()
    gameMasterId: string;

    @ManyToOne(() => User, (user) => user.campaigns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'gameMasterId' })
    gameMaster: User;

    @OneToMany(() => Character, (character) => character.campaign)
    characters: Character[];

    @OneToMany(() => Npc, (npc) => npc.campaign)
    npcs: Npc[];

    @OneToMany(() => Item, (item) => item.campaign)
    items: Item[];

    @OneToMany(() => Session, (session) => session.campaign)
    sessions: Session[];

    @OneToMany(() => Media, (media) => media.campaign)
    media: Media[];

    @OneToMany(() => CampaignMember, (member) => member.campaign)
    members: CampaignMember[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
