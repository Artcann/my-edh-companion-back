import { GameService } from './game.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService
  ) { }
  
  @Post('create')
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }
  
}
