import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";

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

  @Get('claim/:playerId')
  async claimPlayer(@Request() req, @Param('playerId') playerId: number) {
    const user = await this.playerService.claimPlayer(req.user.id, playerId);
    
    delete user.password

    return user;
  }
}