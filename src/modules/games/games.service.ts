import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../shared/entities/game.entity';
import { CreateGameDto } from '../../shared/dtos/games/create-game.dto';
import { User } from '../../shared/entities/user.entity';
import { GameStatus } from '../../common/enums/game-status.enum';
import { GameGateway } from '../../gateways/game.gateway';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly gameGateway: GameGateway,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const playerX = await this.userRepository.findOne({
      where: { id: createGameDto.playerX },
    });
    if (!playerX) {
      throw new NotFoundException(
        `User with ID ${createGameDto.playerX} not found`,
      );
    }
    const game = this.gameRepository.create({
      status: GameStatus.Pending,
      playerX: playerX,
      playerO: null,
    });
    console.log('Creating game:', game);
    return this.gameRepository.save(game);
  }

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({ relations: ['playerX', 'playerO'] });
  }

  async joinPlayerO(gameId: string, playerOId: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerX', 'playerO'],
    });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    if (game.playerO) {
      throw new Error(`The game is already full`);
    }
    const playerO = await this.userRepository.findOne({
      where: { id: playerOId },
    });
    if (!playerO) {
      throw new NotFoundException(`User with ID ${playerOId} not found`);
    }
    if (game.playerX && game.playerX.id == playerOId) {
      throw new Error(`Player O cannot be the same as Player X`);
    }
    game.playerO = playerO;
    game.status = GameStatus.InProgress;
    const updatedGame = await this.gameRepository.save(game);
    this.gameGateway.broadcastGameStatus(updatedGame.id, updatedGame.status);
    return updatedGame;
  }
}
