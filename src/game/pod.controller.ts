import { PodService } from './pod.service';
import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { CreatePodDto } from './dto/create-pod.dto';

@Controller('pod')
export class PodController {
  constructor(
    private podService: PodService
  ) { }
  
  @Post('create')
  async create(@Body() createPodDto: CreatePodDto) {
    return this.podService.create(createPodDto);
  }

  @Get('me')
  async getAllPodOfCurrentUser(@Request() req) {
    return this.podService.getPodByUserId(req.user.id);
  }

  @Get('/user/:userId')
  async getAllPodOfUser(@Param('userId') userId: number) {
    return this.podService.getPodByUserId(userId);
  }

  @Get(':podId')
  async getAllPlayerOfPod(@Param('podId') podId: number) {
    return this.podService.findOne(podId)
  }
}