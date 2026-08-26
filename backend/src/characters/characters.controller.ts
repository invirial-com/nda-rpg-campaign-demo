import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) { }

    @Post()
    create(@Body() createCharacterDto: any, @Request() req) {
        return this.charactersService.create(createCharacterDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.charactersService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.charactersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCharacterDto: any) {
        return this.charactersService.update(id, updateCharacterDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.charactersService.remove(id);
    }
}
