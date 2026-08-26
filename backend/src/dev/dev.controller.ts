import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { DevService } from './dev.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../database/entities/user.entity';

@Controller('dev')
export class DevController {
    constructor(private readonly devService: DevService) { }

    @UseGuards(JwtAuthGuard)
    @Post('command')
    async executeCommand(@Body() body: { command: string }, @Request() req) {
        // Check if user is admin
        // Note: In a real app, we should have a RolesGuard. 
        // For now, we check manually.
        if (req.user.role !== UserRole.ADMIN) {
            // Allow access for now if we haven't set up admin yet, or strictly enforce it.
            // Let's strictly enforce it but provide a way to become admin via DB.
            throw new UnauthorizedException('Only admins can access the developer console.');
        }

        return this.devService.execute(body.command);
    }

    @Post('seed-public')
    async seedPublic() {
        return this.devService.execute('db:seed');
    }
}
