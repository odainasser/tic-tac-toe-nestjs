import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
  Put,
  Get,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from '../../shared/dtos/games/create-game.dto';
import { Game } from '../../shared/entities/game.entity';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../security/auth/guards/jwt-auth.guard';
import { JoinGameDto } from '../../shared/dtos/games/join-game.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a new game as Player X' })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Put(':id/join')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Join a game as Player O' })
  async joinPlayerO(
    @Param('id') gameId: string,
    @Body() joinGameDto: JoinGameDto,
  ): Promise<Game> {
    return this.gamesService.joinPlayerO(gameId, joinGameDto.playerO);
  }
}
