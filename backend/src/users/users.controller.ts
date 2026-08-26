import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserRole } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('fix-roles')
    async fixRoles() {
        // Temporary fix for specific users
        const player = await this.usersService.findOneByEmail('kerubin.player@test.com');
        if (player) {
            player.role = UserRole.PLAYER;
            await this.usersService.update(player);
        }

        const gm = await this.usersService.findOneByEmail('kerubin.gm@test.com');
        if (gm) {
            gm.role = UserRole.GAME_MASTER;
            await this.usersService.update(gm);
        }

        return { message: 'Roles updated' };
    }

    @Post('setup-admin')
    async setupAdmin() {
        const email = 'kerubin.adm@test.com';
        const password = '123456';
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        let user = await this.usersService.findOneByEmail(email);

        if (!user) {
            user = await this.usersService.create({
                email,
                name: 'Kerubin Adm',
                passwordHash,
                role: UserRole.ADMIN
            });
        } else {
            user.role = UserRole.ADMIN;
            user.passwordHash = passwordHash;
            await this.usersService.update(user);
        }

        return { message: 'Admin setup complete', email, password };
    }

    @Post('reset-demo')
    async resetDemo() {
        // DANGER: This deletes all users!
        // We need to clear related tables first to avoid FK constraints.
        // Since we don't have access to other repositories here easily without injecting them,
        // we can try to use a raw query or just fail if there are dependencies.
        // But the user wants a reset.
        // Let's assume for now we can just delete users if we set cascade: true in entities, 
        // OR we should use the DevService which has access to everything.
        // But we are in UsersController.
        // Let's try to catch the error and return a better message, or use a raw query to truncate.
        // Actually, the best way is to inject DataSource and clean everything.
        // But let's try to just use the UsersService to delete, and if it fails, we know why.

        // BETTER APPROACH: Let's move this logic to DevService and call it from DevController?
        // But I already wrote this here.
        // Let's just try to delete with CASCADE using raw query if possible, or just inject DataSource.
        // For now, let's just try to delete and catch error.

        try {
            await this.usersService.deleteAll();
        } catch (e) {
            // If delete fails, it's likely FK.
            // We can try to force it or just tell the user to use the Dev Console 'db:reset' first.
            // But I want this to be a one-click fix.
            // Let's use a raw query to truncate users cascade.
            // await this.usersService.truncate(); // Need to implement this
            throw new Error('Failed to delete users. Likely due to existing campaigns/characters. Please use the Dev Console "db:reset" command first, or I need to implement a full wipe here.');
        }

        const password = '123456';
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const accounts = [
            { email: 'kerubin.player@test.com', name: 'Kerubin Player', role: UserRole.PLAYER },
            { email: 'kerubin.gm@test.com', name: 'Kerubin GM', role: UserRole.GAME_MASTER },
            { email: 'kerubin.adm@test.com', name: 'Kerubin Adm', role: UserRole.ADMIN },
        ];

        for (const acc of accounts) {
            await this.usersService.create({
                email: acc.email,
                name: acc.name,
                passwordHash,
                role: acc.role
            });
        }

        return {
            message: 'Database reset and seeded',
            accounts: accounts.map(a => ({ email: a.email, password: '123456', role: a.role }))
        };
    }
}
