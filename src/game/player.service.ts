import { CreatePlayerDto } from './dto/create-player.dto';
import { Injectable } from "@nestjs/common";
import { Player } from './entities/player.entity';
import { Pod } from './entities/pod.entity';

@Injectable()
export class PlayerService {
  async create(createPlayerDto: CreatePlayerDto) {
    const player = Player.create<Player>(createPlayerDto);
    const pod = await Pod.findOneBy({ id: createPlayerDto.podId });
    if (pod.players === undefined) {
      pod.players = [];
    }
    pod.players.push(player);
    pod.save();
    return player.save();
  }

  async findOne(id: number) {
    return Player.findOneBy({ id: id });
  }

  async findAll() {
    return Player.find();
  }

  async update() {

  }

  async delete(id: number) {
    return Player.delete({ id: id });
  }
}
