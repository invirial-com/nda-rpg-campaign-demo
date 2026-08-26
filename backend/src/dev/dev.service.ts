import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Character } from '../database/entities/character.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { CampaignMember } from '../database/entities/campaign-member.entity';
import { Npc } from '../database/entities/npc.entity';
import { Item } from '../database/entities/item.entity';
import { Session } from '../database/entities/session.entity';
import { Media } from '../database/entities/media.entity';
import { CharacterInventory } from '../database/entities/character-inventory.entity';

@Injectable()
export class DevService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Campaign)
        private campaignsRepository: Repository<Campaign>,
        @InjectRepository(Character)
        private charactersRepository: Repository<Character>,
        @InjectRepository(RefreshToken)
        private refreshTokensRepository: Repository<RefreshToken>,
        @InjectRepository(CampaignMember)
        private campaignMembersRepository: Repository<CampaignMember>,
        @InjectRepository(Npc)
        private npcsRepository: Repository<Npc>,
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
        @InjectRepository(Session)
        private sessionsRepository: Repository<Session>,
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>,
        @InjectRepository(CharacterInventory)
        private characterInventoryRepository: Repository<CharacterInventory>,
    ) { }

    async execute(commandStr: string): Promise<any> {
        const [command, ...args] = commandStr.split(' ');

        switch (command) {
            case 'help':
                return {
                    output: `Available commands:
- help: Show this help message
- users:list: List all users
- db:stats: Show database statistics
- db:reset: Clear all data (Dangerous!)
- db:seed: Clear all data and seed with demo accounts (Dangerous!)
- make:admin <email>: Make a user an admin`
                };

            case 'users:list':
                const users = await this.usersRepository.find();
                return {
                    output: users.map(u => `[${u.role}] ${u.name} (${u.email})`).join('\n')
                };

            case 'db:stats':
                const userCount = await this.usersRepository.count();
                const campaignCount = await this.campaignsRepository.count();
                const charCount = await this.charactersRepository.count();
                return {
                    output: `Database Statistics:
- Users: ${userCount}
- Campaigns: ${campaignCount}
- Characters: ${charCount}`
                };

            case 'make:admin':
                const email = args[0];
                if (!email) return { output: 'Usage: make:admin <email>' };
                const userToPromote = await this.usersRepository.findOne({ where: { email } });
                if (!userToPromote) return { output: `User not found: ${email}` };
                userToPromote.role = UserRole.ADMIN;
                await this.usersRepository.save(userToPromote);
                return { output: `User ${email} is now an ADMIN.` };

            case 'db:reset':
                // Be very careful with this!
                await this.characterInventoryRepository.delete({});
                await this.mediaRepository.delete({});
                await this.sessionsRepository.delete({});
                await this.itemsRepository.delete({});
                await this.npcsRepository.delete({});
                await this.refreshTokensRepository.delete({});
                await this.campaignMembersRepository.delete({});
                await this.charactersRepository.delete({});
                await this.campaignsRepository.delete({});
                // We might want to keep users to avoid locking ourselves out
                return { output: 'Database cleared (Campaigns, Characters, Members, Tokens, Items, NPCs, Sessions, Media).' };

            case 'db:seed':
                try {
                    // Full wipe using TRUNCATE CASCADE
                    // This is Postgres specific but very effective
                    console.log('Truncating tables...');
                    await this.usersRepository.query('TRUNCATE TABLE users CASCADE');

                    // Hash for '123456'
                    const passwordHash = '$2b$10$EpRnTzVlqHNP0.fUbXUwSO90oCNI7uDb45fxQacM5dN0.b.tLVa';

                    const accounts = [
                        { email: 'kerubin.player@test.com', name: 'Kerubin Player', role: UserRole.PLAYER },
                        { email: 'kerubin.gm@test.com', name: 'Kerubin GM', role: UserRole.GAME_MASTER },
                        { email: 'kerubin.adm@test.com', name: 'Kerubin Adm', role: UserRole.ADMIN },
                    ];

                    for (const acc of accounts) {
                        await this.usersRepository.save(this.usersRepository.create({
                            email: acc.email,
                            name: acc.name,
                            passwordHash,
                            role: acc.role
                        }));
                    }

                    return { output: 'Database reset and seeded with 3 demo accounts (Password: 123456).' };
                } catch (error) {
                    console.error('Error in db:seed:', error);
                    return { output: `Error: ${error.message}` };
                }

            default:
                return { output: `Unknown command: ${command}. Type 'help' for available commands.` };
        }
    }
}
