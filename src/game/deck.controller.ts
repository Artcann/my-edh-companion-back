import { Body, Controller, Get, Post, Req } from "@nestjs/common";
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

  @Get('me')
  async getAllDeckOfCurrentUser(@Req() req) {
    return this.deckService.getDecksOfUser(req.user.id);
  }
}