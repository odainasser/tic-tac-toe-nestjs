import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Move } from '../../shared/entities/move.entity';
import { MovesService } from './moves.service';
import { MovesController } from './moves.controller';
import { User } from '../../shared/entities/user.entity';
import { Game } from '../../shared/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Move, User, Game])],
  providers: [MovesService],
  controllers: [MovesController],
})
export class MovesModule {}
