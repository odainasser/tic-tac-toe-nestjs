import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Move } from '../../shared/entities/move.entity';
import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { User } from '../../shared/entities/user.entity';
import { Game } from '../../shared/entities/game.entity';
import { GamesModule } from '../games/games.module';
import { GameGateway } from '../../gateways/game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Move, User, Game]), GamesModule],
  providers: [MovesService, GameGateway],
  controllers: [MovesController],
})
export class MovesModule {}
