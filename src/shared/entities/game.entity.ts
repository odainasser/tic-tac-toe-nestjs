import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { GameStatus } from '../../common/enums/game-status.enum';
import { GameWinner } from '../../common/enums/game-winner.enum';
import { Move } from './move.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.Pending,
  })
  status: GameStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player_x' })
  playerX: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'player_o' })
  playerO?: User;

  @Column({
    type: 'enum',
    enum: GameWinner,
    nullable: true,
  })
  winner?: GameWinner;

  @OneToMany(() => Move, (move) => move.game)
  moves: Move[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
