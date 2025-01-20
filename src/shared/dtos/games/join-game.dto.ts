import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinGameDto {
  @ApiProperty({
    description: 'The UUID of player O',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID('4', { message: 'playerO must be a valid UUID' })
  playerO: string;
}
