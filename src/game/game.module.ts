import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';

@Module({
  providers: [GameService, PodService, PlayerService, DeckService, GameService],
  controllers: [GameController, PodController, PlayerController, DeckController, GameController]
})
export class GameModule {}
