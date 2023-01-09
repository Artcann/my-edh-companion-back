import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Update } from "aws-sdk/clients/dynamodb";
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

  @Get(":id")
  async getSpecificUser(@Param("id") userId: number) {
    return this.userService.findOneById(userId)
  }
}