import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Move } from '../../shared/entities/move.entity';
import { CreateMoveDto } from '../../shared/dtos/moves/create-move.dto';
import { User } from '../../shared/entities/user.entity';
import { Game } from '../../shared/entities/game.entity';
import { GameStatus } from '../../common/enums/game-status.enum';
import { GameGateway } from '../../gateways/game.gateway';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly gameGateway: GameGateway,
  ) {}

  async createMove(createMoveDto: CreateMoveDto): Promise<Move> {
    const move = this.moveRepository.create(createMoveDto);

    const { playerId, gameId, row, col } = createMoveDto;

    this.validateRowAndColumn(row, col);
    move.player = await this.validatePlayer(playerId);
    move.game = await this.validateGame(gameId, row, col);

    await this.validatePlayerTurn(move.game, move.player);

    const savedMove = await this.moveRepository.save(move);

    if (await this.validateWinner(move.game.id, row, col, move.player.id)) {
      move.game.status = GameStatus.Completed;
      await this.gameRepository.save(move.game);
      this.gameGateway.broadcastMove(move);
    }

    return savedMove;
  }

  private async validateWinner(
    gameId: string,
    row: number,
    col: number,
    playerId: string,
  ): Promise<boolean> {
    const moves = await this.moveRepository.find({
      where: { game: { id: gameId }, player: { id: playerId } },
    });

    const board = Array.from({ length: 3 }, () => Array(3).fill(null));
    moves.forEach((move) => {
      if (move.player) {
        board[move.row][move.col] = move.player.id;
      }
    });

    const winPatterns = [
      // Rows
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      // Columns
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      // Diagonals
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    return winPatterns.some((pattern) =>
      pattern.every(([r, c]) => board[r][c] === playerId),
    );
  }

  private validateRowAndColumn(row: number, col: number): void {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      throw new Error('Invalid move: row and column must be between 0 and 2');
    }
  }

  private async validatePlayer(playerId: string): Promise<User> {
    if (playerId) {
      const player = await this.userRepository.findOne({
        where: { id: playerId },
      });
      if (!player) {
        throw new Error('Player not found');
      }
      return player;
    }
    throw new Error('Player ID is required');
  }

  private async validateGame(
    gameId: string,
    row: number,
    col: number,
  ): Promise<Game> {
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

      const existingMove = await this.moveRepository.findOne({
        where: { game: { id: gameId }, row, col },
      });
      if (existingMove) {
        throw new Error('Cell is already filled');
      }

      return game;
    }
    throw new Error('Game ID is required');
  }

  private async validatePlayerTurn(game: Game, player: User): Promise<void> {
    const lastMove = await this.moveRepository.findOne({
      where: { game: { id: game.id } },
      relations: ['player'],
      order: { createdAt: 'DESC' },
    });

    if (lastMove && lastMove.player.id === player.id) {
      throw new Error('It is not your turn');
    }
  }
}
