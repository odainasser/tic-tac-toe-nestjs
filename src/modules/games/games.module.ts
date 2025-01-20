import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from '../../shared/entities/game.entity';
import { User } from '../../shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
