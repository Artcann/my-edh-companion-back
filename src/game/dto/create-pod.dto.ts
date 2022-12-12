import { CreatePlayerDto } from './create-player.dto';
import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { Player } from "../entities/player.entity"

export class CreatePodDto {
  name: string
}