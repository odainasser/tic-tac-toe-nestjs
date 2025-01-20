import { IsEnum, IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MoveMark } from '../../../common/enums/move.enum';

export class CreateMoveDto {
  @ApiProperty({
    description: 'The ID of the player making the move',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    description: 'The ID of the game',
    example: 'a123f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({
    description: 'The row index of the move',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  row: number;

  @ApiProperty({
    description: 'The column index of the move',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  col: number;

  @ApiProperty({
    description: 'The mark of the move, either X or O',
    enum: MoveMark,
    example: MoveMark.X,
  })
  @IsEnum(MoveMark)
  @IsNotEmpty()
  mark: MoveMark;
}
