import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../database/entities/campaign.entity';
import { CampaignMember, InvitationStatus } from '../database/entities/campaign-member.entity';

@Injectable()
export class CampaignsService {
    constructor(
        @InjectRepository(Campaign)
        private campaignsRepository: Repository<Campaign>,
        @InjectRepository(CampaignMember)
        private campaignMembersRepository: Repository<CampaignMember>,
    ) { }

    create(createCampaignDto: any, userId: string) {
        const inviteCode = 'QST-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        const campaign = this.campaignsRepository.create({
            ...createCampaignDto,
            inviteCode,
            gameMasterId: userId,
        });
        return this.campaignsRepository.save(campaign);
    }

    findAll(userId: string) {
        return this.campaignsRepository.find({
            where: { gameMasterId: userId },
        });
    }

    async findOne(id: string) {
        return this.campaignsRepository.findOne({
            where: { id },
            relations: ['characters', 'npcs', 'items', 'sessions', 'media', 'members', 'members.user', 'gameMaster'],
        });
    }

    update(id: string, updateCampaignDto: any) {
        return this.campaignsRepository.update(id, updateCampaignDto);
    }

    remove(id: string) {
        return this.campaignsRepository.delete(id);
    }

    async join(inviteCode: string, userId: string) {
        const campaign = await this.campaignsRepository.findOne({ where: { inviteCode } });
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // Check if already a member
        const existingMember = await this.campaignMembersRepository.findOne({
            where: { campaignId: campaign.id, userId }
        });

        if (existingMember) {
            return { message: 'Already a member', campaignId: campaign.id };
        }

        // Create member
        const member = this.campaignMembersRepository.create({
            campaignId: campaign.id,
            userId,
            status: InvitationStatus.ACCEPTED
        });
        await this.campaignMembersRepository.save(member);

        return { message: 'Joined campaign', campaignId: campaign.id };
    }

    async removeMember(campaignId: string, userId: string) {
        return this.campaignMembersRepository.delete({ campaignId, userId });
    }
}
