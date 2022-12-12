import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { Body, Controller, Post } from "@nestjs/common";

@Controller("player")
export class PlayerController {
  constructor(
    private playerService: PlayerService
  ) { }
  
  @Post('create')
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }
}