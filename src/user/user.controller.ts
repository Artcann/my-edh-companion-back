import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Update } from "aws-sdk/clients/dynamodb";
import { ArchidektService } from "src/decks/archidekt.service";
import { DeckService } from "src/decks/deck.service";
import { DeckStatsDTO } from "src/decks/dto/deck-stats.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService
  ) { }
  
  @Get("me")
  async getProfile(@Req() req) {
    return this.userService.findOneById(req.user.id)
  }

  @Post("update/:id")
  async updateSpecificUser(@Body() updateUserDto: UpdateUserDto ,@Param("id") userId: number) {
    return this.userService.update(userId, updateUserDto)
  }

  @Get("stats")
  async getUserStats(@Req() req) {
    return await this.userService.getUserStats(req.user.id)
  }

  @Get(":id")
  async getSpecificUser(@Param("id") userId: number) {
    return this.userService.findOneById(userId)
  }

  

}