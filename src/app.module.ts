import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/security/users/users.module';
import { AuthModule } from './modules/security/auth/auth.module';
import { GamesModule } from './modules/games/games.module';
import { MovesModule } from './modules/moves/moves.module';
import { GameGateway } from './gateways/game.gateway';
import { CacheGlobalModule } from './modules/cache/cache.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    CacheGlobalModule,
    AuthModule,
    UsersModule,
    GamesModule,
    MovesModule,
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule {}
