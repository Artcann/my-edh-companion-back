import { DecksController } from './decks.controller';
import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { ScryfallService } from "./scryfall.service";
import { ArchidektService } from './archidekt.service';
import { GameModule } from 'src/game/game.module';
import { DeckService } from './deck.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ScryfallService, ArchidektService, DeckService],
  exports: [ArchidektService, DeckService],
  imports: [HttpModule, GameModule, forwardRef(() => UserModule)],
  controllers: [DecksController]
})
export class DecksModule {}