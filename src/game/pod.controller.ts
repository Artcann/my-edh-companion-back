import { PodService } from './pod.service';
import { Body, Controller, Post } from "@nestjs/common";
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
}