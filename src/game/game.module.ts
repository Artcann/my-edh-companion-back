import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { DecksModule } from 'src/decks/decks.module';

@Module({
  providers: [GameService, PodService, PlayerService, GameService],
  controllers: [GameController, PodController, PlayerController, GameController],
})
export class GameModule {}
