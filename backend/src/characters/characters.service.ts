import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../database/entities/character.entity';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character)
        private charactersRepository: Repository<Character>,
    ) { }

    create(createCharacterDto: any, userId: string) {
        const character = this.charactersRepository.create({
            ...createCharacterDto,
            playerId: userId,
        });
        return this.charactersRepository.save(character);
    }

    findAll(userId: string) {
        return this.charactersRepository.find({
            where: { playerId: userId },
        });
    }

    findOne(id: string) {
        return this.charactersRepository.findOne({
            where: { id },
            relations: ['inventory', 'campaign'],
        });
    }

    update(id: string, updateCharacterDto: any) {
        return this.charactersRepository.update(id, updateCharacterDto);
    }

    remove(id: string) {
        return this.charactersRepository.delete(id);
    }
}
