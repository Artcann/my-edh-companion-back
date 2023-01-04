import { Player } from 'src/game/entities/player.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { Pod } from './entities/pod.entity';
import { Deck } from '../decks/entities/deck.entity';

@Injectable()
export class GameService {

  async create(createGameDto: CreateGameDto) {
    const players = await Deck.createQueryBuilder("deck")
      .where("deck.id IN (:...decksId)", { decksId: createGameDto.decksId })
      .getMany()

    const pod = await Pod.findOneBy({ id: createGameDto.podId });
    
    const game = Game.create<Game>(createGameDto);

    game.players = players;
    game.pod = pod;

    return game.save();
  }

  async addPlayerToGame(deckId: number, gameId: number) {
    const deck = await Deck.findOneBy({ id: deckId });
    const game = await Game.findOneBy({ id: gameId });

    if (game.players === undefined) {
      game.players = [];
    }

    game.players.push(deck);

    return game.save();
  }

  async setWinnerToGame(deckId: number, gameId: number) {
    const deck = await Deck.findOneBy({ id: deckId });
    const game = await Game.findOneBy({ id: gameId });

    game.winner = deck;

    return game.save();
  }

  async getRecentGames(userId: number, limit: number) {
    return Game.createQueryBuilder("game")
    .leftJoinAndSelect("game.players", "deck")
    .leftJoinAndSelect("deck.player_owner", "player")
    .leftJoin("deck.user_owner", "user2")
    .leftJoin("player.user", "user")
    .addSelect(["user2.id", "user2.username"])
    .where("user.id = :id OR user2.id = :id", { id: userId })
    .orderBy("game.date", "ASC")
    .limit(limit)
    .getMany();
  }
}
