import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { DevModule } from './dev/dev.module';
import { User } from './database/entities/user.entity';
import { Campaign } from './database/entities/campaign.entity';
import { Character } from './database/entities/character.entity';
import { Npc } from './database/entities/npc.entity';
import { Item } from './database/entities/item.entity';
import { Session } from './database/entities/session.entity';
import { Media } from './database/entities/media.entity';
import { RefreshToken } from './database/entities/refresh-token.entity';
import { CampaignMember } from './database/entities/campaign-member.entity';
import { CharacterInventory } from './database/entities/character-inventory.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'NdaCampaignDemo'),
        entities: [User, Campaign, Character, Npc, Item, Session, Media, RefreshToken, CampaignMember, CharacterInventory],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CampaignsModule,
    CharactersModule,
    DevModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
