import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { Body, Controller, Get, Param, Post, Req, Request } from "@nestjs/common";
import { User } from 'src/user/entities/user.entity';
import { userInfo } from 'os';

@Controller("player")
export class PlayerController {
  constructor(
    private playerService: PlayerService
  ) { }
  
  @Post('create')
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Post('create/me')
  async createWithUserId(@Body() createPlayerDto: CreatePlayerDto, @Req() req) {
    const user = await User.findOneBy({id: req.user.id})
    const player = await this.playerService.create(createPlayerDto)

    player.user = user
    return player.save()
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