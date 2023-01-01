import { DecksController } from './decks.controller';
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ScryfallService } from "./scryfall.service";
import { ArchidektService } from './archidekt.service';
import { GameModule } from 'src/game/game.module';
import { DeckService } from './deck.service';

@Module({
  providers: [ScryfallService, ArchidektService, DeckService],
  imports: [HttpModule, GameModule],
  controllers: [DecksController]
})
export class DecksModule {}