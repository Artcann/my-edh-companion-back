import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './auth/entities/role.entity';
import { Token } from './auth/entities/mail-token.entity';
import { GameModule } from './game/game.module';
import { Player } from './game/entities/player.entity';
import { Game } from './game/entities/game.entity';
import { Pod } from './game/entities/pod.entity';
import { Deck } from './game/entities/deck.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'edh-companion',
      entities: [User, Role, Token, Player, Game, Pod, Deck],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule, 
    UserModule, GameModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {}
