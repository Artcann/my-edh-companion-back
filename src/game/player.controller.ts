import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { Body, Controller, Get, Post, Request } from "@nestjs/common";

@Controller("player")
export class PlayerController {
  constructor(
    private playerService: PlayerService
  ) { }
  
  @Post('create')
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get('me')
  async getAllPlayerOfCurrentUser(@Request() req) {
    return this.playerService.findByUserId(req.user.id);
  }
}