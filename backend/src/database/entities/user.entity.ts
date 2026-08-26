import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Campaign } from './campaign.entity';
import { Character } from './character.entity';
import { RefreshToken } from './refresh-token.entity';
import { CampaignMember } from './campaign-member.entity';

export enum UserRole {
  PLAYER = 'player',
  GAME_MASTER = 'game_master',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.gameMaster)
  campaigns: Campaign[];

  @OneToMany(() => Character, (character) => character.player)
  characters: Character[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => CampaignMember, (member) => member.user)
  memberships: CampaignMember[];
}
