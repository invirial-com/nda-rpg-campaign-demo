import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    @Post()
    create(@Body() createCampaignDto: any, @Request() req) {
        return this.campaignsService.create(createCampaignDto, req.user.id);
    }

    @Post('join')
    join(@Body() body: { inviteCode: string }, @Request() req) {
        return this.campaignsService.join(body.inviteCode, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.campaignsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.campaignsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCampaignDto: any) {
        return this.campaignsService.update(id, updateCampaignDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.campaignsService.remove(id);
    }

    @Delete(':id/members/:userId')
    removeMember(@Param('id') id: string, @Param('userId') userId: string) {
        return this.campaignsService.removeMember(id, userId);
    }
}
