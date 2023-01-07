import { ArchidektLoginDto } from './dto/archidekt-login.dto';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ArchidektService } from './archidekt.service';
import { User } from 'src/user/entities/user.entity';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UserService } from 'src/user/user.service';

@Controller("deck")
export class DecksController {
  constructor(
    private archidektService: ArchidektService,
    private deckService: DeckService,
    private userService: UserService
  ) { }

  @Post('create')
  async create(@Body() createDeckDto: CreateDeckDto) {
    return this.deckService.create(createDeckDto);
  }

  @Get('me')
  async getAllDeckOfCurrentUser(@Req() req) {
    return this.deckService.getDecksOfUser(req.user.id);
  }

  @Get('player/:playerId')
  async getAllDeckOfSpecifiedPlayer(@Param("playerId") playerId: number) {
    const user = await this.userService.findOneByPlayerId(playerId)
    return this.deckService.getDecksOfUser(user.id)
  }
  
  @Post("archidekt/login")
  async loginArchidekt(@Body() archidektLoginDto: ArchidektLoginDto, @Req() req) {
    const user = await User.findOneBy({
      id: req.user.id
    })

    const tokens = await this.archidektService.login(archidektLoginDto.email, archidektLoginDto.password);

    user.archidektAccessToken = tokens.access_token
    user.archidektRefreshToken = tokens.refresh_token
    user.archidektId = tokens.user.id

    user.save()

    return tokens
  }

  @Get("archidekt/deck")
  async getDecksByUserId(@Req() req, @Query() query) {
    const user = await User.findOneBy({
      id: req.user.id
    })

    if (query.page === undefined) {
      query.page = 1
    }

    return this.archidektService.getDecksByUserId(user.archidektId, user.archidektAccessToken, query.page)
  }

  @Get("archidekt/fetch/all")
  async fetchAndSaveAllDecks(@Req() req) {
    const user = await User.findOneBy({
      id: req.user.id
    })

    return this.archidektService.fetchAndSaveAllDecks(user);
  }

}