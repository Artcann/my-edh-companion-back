import { GameService } from './game.service';
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { query } from 'express';

@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService
  ) { }
  
  @Get('recent')
  async getRecent(@Req() req) {
    return this.gameService.getRecentGames(req.user.id, 20)
  }

  @Post('create')
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }
  
  @Get('addDeck')
  async addDeckToDeck(@Query() query) {
    return this.gameService.addPlayerToGame(query.deckId, query.gameId);
  }

  @Get('setWinner')
  async setWinnerToGame(@Query() query) {
    return this.gameService.setWinnerToGame(query.deckId, query.gameId);
  }
}
