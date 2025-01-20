import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MovesService } from './moves.service';
import { CreateMoveDto } from '../../shared/dtos/moves/create-move.dto';
import { Move } from '../../shared/entities/move.entity';
import { JwtAuthGuard } from '../security/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('moves')
@Controller('moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Create a new move' })
  async createMove(@Body() createMoveDto: CreateMoveDto): Promise<Move> {
    return this.movesService.createMove(createMoveDto);
  }
}
