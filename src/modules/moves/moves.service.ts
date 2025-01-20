import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Move } from '../../shared/entities/move.entity';
import { CreateMoveDto } from '../../shared/dtos/moves/create-move.dto';
import { User } from '../../shared/entities/user.entity';
import { Game } from '../../shared/entities/game.entity';
import { GameStatus } from 'src/common/enums/game-status.enum';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async createMove(createMoveDto: CreateMoveDto): Promise<Move> {
    const { playerId, gameId } = createMoveDto;

    const move = this.moveRepository.create(createMoveDto);

    if (playerId) {
      const player = await this.userRepository.findOne({
        where: { id: playerId },
      });
      if (!player) {
        throw new Error('Player not found');
      }
      move.player = player;
    }

    if (gameId) {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new Error('Game not found');
      }
      if (game.status !== GameStatus.InProgress) {
        throw new Error('Game is not in progress');
      }
      move.game = game;
    }

    return this.moveRepository.save(move);
  }
}
