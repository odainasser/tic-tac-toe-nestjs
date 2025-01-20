import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from './user.entity';
import { MoveMark } from '../../common/enums/move.enum';

@Entity('moves')
export class Move {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Game, (game) => game.moves)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player_id' })
  player: User;

  @Column()
  row: number;

  @Column()
  col: number;

  @Column({
    type: 'enum',
    enum: MoveMark,
  })
  mark: MoveMark;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
