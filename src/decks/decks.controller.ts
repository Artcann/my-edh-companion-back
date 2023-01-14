import { ArchidektLoginDto } from './dto/archidekt-login.dto';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ArchidektService } from './archidekt.service';
import { User } from 'src/user/entities/user.entity';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UserService } from 'src/user/user.service';
import { forwardRef } from '@nestjs/common/utils';

@Controller("deck")
export class DecksController {
  constructor(
    private archidektService: ArchidektService,
    private deckService: DeckService,
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
    return this.deckService.getDecksOfSpecificPlayer(playerId)    
  }
  
  @Get("archidekt/deck")
  async getDecksByUserId(@Req() req, @Query() query) {
    const user = await User.findOneBy({
      id: req.user.id
    })

    if (query.page === undefined) {
      query.page = 1
    }

    return this.archidektService.getDecksByUsername(user.archidektUsername, query.page)
  }

  @Get("archidekt/fetch/all")
  async fetchAndSaveAllDecks(@Req() req) {
    const user = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.archidekt_decks", "decks")
      .where("user.id = :id", {id: req.user.id})
      .getOne()

    const decks = await this.archidektService.fetchAndSaveAllDecks(user);
    this.archidektService.fetchDeckName(decks, user);

    return decks
  }

  @Get("stats/:id")
  async getDeckStats(@Param("id") archidektId: string) {
    return this.archidektService.fetchDeckStats(archidektId);
  }

  @Get("winrates/:id")
  async getDeckWinrate(@Param("id") deckId: number, @Query() query) {
    return this.deckService.getWinrate(deckId, query.podId, query.opponentDeckId, query.opponentId)
  }

}