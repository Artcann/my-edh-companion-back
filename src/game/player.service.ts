import { User } from 'src/user/entities/user.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException, Injectable } from "@nestjs/common";
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

  async findByUserId(userId: number) {
    return Player.createQueryBuilder('player')
      .leftJoin('player.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  }

  async claimPlayer(userId: number, playerId: number) {
    const player = await Player.findOneBy({ id: playerId });
    const user = await User.findOneBy({ id: userId });

    if (player.user !== undefined) {
      throw new BadRequestException({
        error: "This player has already been claimed"
      })
    }

    if (user.players === undefined) {
      user.players = []
    }

    user.players.push(player);
    
    return user.save();
  }

  async update() {

  }

  async delete(id: number) {
    return Player.delete({ id: id });
  }
}
