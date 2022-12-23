import { CardsController } from './cards.controller';
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ScryfallService } from "./scryfall.service";
import { ArchidektService } from './archidekt.service';

@Module({
  providers: [ScryfallService, ArchidektService],
  imports: [HttpModule],
  controllers: [CardsController]
})
export class CardsModule {}