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

    if(deck.wins === undefined) {
      deck.wins = []
    }

    deck.wins.push(game)

    return deck.save();
  }

  async getRecentGames(userId: number, limit: number) {
    const games = await Game.createQueryBuilder("game")
      .leftJoin("game.players", "deck")
      .leftJoin("game.winner", "winner")
      .leftJoin("deck.user_owner", "user2")
      .leftJoin("deck.player_owner", "player")
      .leftJoin("player.user", "user")
      .where("user.id = :id OR user2.id = :id", { id: userId })
      .getMany()

    const gamesId = games.map(game => game.id)

    return Game.createQueryBuilder("game")
    .leftJoinAndSelect("game.players", "deck")
    .leftJoinAndSelect("game.winner", "winner")
    .leftJoinAndSelect("deck.player_owner", "player")
    .leftJoin("deck.user_owner", "user")
    .leftJoin("player.user", "user2")
    .addSelect(["user2.id", "user2.username", "user.id", "user.username"])
    .where("game.id = ANY(:gamesId)", { gamesId: gamesId })
    .orderBy("game.date", "ASC")
    .limit(limit)
    .getMany();
  }

  async getGamesByPodId(podId: number) {
    const games = await Game.createQueryBuilder("game")
      .leftJoin("game.players", "deck")
      .leftJoin("game.winner", "winner")
      .leftJoin("deck.user_owner", "user2")
      .leftJoin("deck.player_owner", "player")
      .leftJoin("game.pod", "pod")
      .where("pod.id = :id", { id: podId })
      .getMany()

      const gamesId = games.map(game => game.id)

    return Game.createQueryBuilder("game")
    .leftJoinAndSelect("game.players", "deck")
    .leftJoinAndSelect("game.winner", "winner")
    .leftJoinAndSelect("deck.player_owner", "player")
    .leftJoin("deck.user_owner", "user")
    .leftJoin("player.user", "user2")
    .addSelect(["user2.id", "user2.username", "user.id", "user.username"])
    .where("game.id = ANY(:gamesId)", { gamesId: gamesId })
    .orderBy("game.date", "ASC")
    .getMany();
  }
}
