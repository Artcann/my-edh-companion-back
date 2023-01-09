import { Controller, Get, Param, Req } from "@nestjs/common";
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

  @Get(":id")
  async getSpecificUser(@Param("id") userId: number) {
    return this.userService.findOneById(userId)
  }
}