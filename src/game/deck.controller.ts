import { Body, Controller, Get, Post } from "@nestjs/common";
import { DeckService } from "./deck.service";
import { CreateDeckDto } from "./dto/create-deck.dto";

@Controller('deck')
export class DeckController {
  constructor(
    private deckService: DeckService
  ) { }
  
  @Post('create')
  async create(@Body() createDeckDto: CreateDeckDto) {
    return this.deckService.create(createDeckDto);
  }
}