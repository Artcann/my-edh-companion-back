import { Player } from 'src/game/entities/player.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { Pod } from './entities/pod.entity';

@Injectable()
export class GameService {

  async create(createGameDto: CreateGameDto) {
    const players = await Player.createQueryBuilder("player")
      .where("player.id IN (:...playersId)", { playersId: createGameDto.playersId })
      .getMany()

    const pod = await Pod.findOneBy({ id: createGameDto.podId });
    
    const game = Game.create<Game>(createGameDto);

    game.players = players;
    game.pod = pod;

    return game.save();
  }
}
