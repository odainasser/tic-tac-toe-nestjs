import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from '../../shared/entities/game.entity';
import { User } from '../../shared/entities/user.entity';
import { GameGateway } from '../../gateways/game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  providers: [GamesService, GameGateway],
  controllers: [GamesController],
})
export class GamesModule {}
