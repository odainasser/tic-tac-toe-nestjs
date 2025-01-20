import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    description: 'The UUID of player X',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID('4', { message: 'playerX must be a valid UUID' })
  playerX: string;
}
