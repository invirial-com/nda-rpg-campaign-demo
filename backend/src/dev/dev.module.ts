import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Character } from '../database/entities/character.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { CampaignMember } from '../database/entities/campaign-member.entity';
import { Npc } from '../database/entities/npc.entity';
import { Item } from '../database/entities/item.entity';
import { Session } from '../database/entities/session.entity';
import { Media } from '../database/entities/media.entity';
import { CharacterInventory } from '../database/entities/character-inventory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        User, Campaign, Character, RefreshToken, CampaignMember,
        Npc, Item, Session, Media, CharacterInventory
    ])],
    controllers: [DevController],
    providers: [DevService],
})
export class DevModule { }
