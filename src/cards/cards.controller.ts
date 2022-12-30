import { ArchidektLoginDto } from './dto/archidekt-login.dto';
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ArchidektService } from './archidekt.service';
import { User } from 'src/user/entities/user.entity';

@Controller("cards")
export class CardsController {
  constructor(
    private archidektService: ArchidektService
  ) { }
  
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

}