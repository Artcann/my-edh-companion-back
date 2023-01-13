import { Injectable } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { Deck } from "./entities/deck.entity";
import { Player } from "../game/entities/player.entity";
import { User } from "src/user/entities/user.entity";
import { DeckWinrateDTO } from "./dto/deck-winrate.dto";
import { Pod } from "src/game/entities/pod.entity";

@Injectable()
export class DeckService {
  async create(createDeckDto: CreateDeckDto) {
    const deck = Deck.create<Deck>(createDeckDto);
    if(createDeckDto.playerOwnerId) {
      const owner = await Player.findOneBy({ id: createDeckDto.playerOwnerId });
      if (owner.decks === undefined) {
        owner.decks = [];
      }
  
      owner.decks.push(deck);
      owner.save();
      deck.player_owner = owner;
    } 
    if(createDeckDto.userOwnerId) {
      const owner = await User.findOneBy({ id: createDeckDto.userOwnerId });
      deck.user_owner = owner
    }

    return deck.save();
  }

  async getDecksOfUser(userId: number) {
    return Deck.createQueryBuilder("deck")
      .leftJoin("deck.player_owner", "player")
      .leftJoin("deck.user_owner", "user2")
      .leftJoin("player.user", "user")
      .where("user.id = :id OR user2.id = :id", { id: userId })
      .getMany();
  }
  
  async getDecksOfPlayer(playerId: number) {
    return Deck.createQueryBuilder("deck")
      .leftJoin("deck.player_owner", "player")
      .where("player.id = :id", {id: playerId})
      .getMany()
  }

  async getWinrate(deckId: number, podId: number = -1, opponentDeckId: number = -1, playerId: number = -1) {
    const deckWinrates = new DeckWinrateDTO()
    const deck = await Deck.findOneBy({id: deckId})
    
    if(podId !== -1) {
      const pod = await Pod.findOneBy({id: podId})
      deckWinrates.local_winrate = pod.games.filter(podGame => deck.wins.some(deckGame => podGame.id === deckGame.id)).length 
      / pod.games.filter(podGame => deck.games.some(deckGame => podGame.id === deckGame.id)).length 
    }

    if(opponentDeckId !== -1) {
      const opponentDeck = await Deck.findOneBy({id: opponentDeckId})
      deckWinrates.deck_headsup_winrate = opponentDeck.games.filter(opponentGame => deck.wins.some(deckGame => deckGame.id === opponentGame.id)).length
      / opponentDeck.games.filter(opponentGame => deck.games.some(deckGame => deckGame.id === opponentGame.id)).length
    }

    if(playerId !== -1) {
      const opponent = await Player.findOneBy({id: playerId})
      const opponentGame = []
      const opponentWins = []
      opponent.decks.map(deck => {
        opponentGame.push(...deck.games)
        opponentWins.push(...deck.wins)
        }
      )
      deckWinrates.player_headsup_winrate = opponentGame.filter(opponentGame => deck.wins.some(deckGame => deckGame.id === opponentGame.id)).length
      / opponentWins.filter(opponentGame => deck.games.some(deckGame => deckGame.id === opponentGame.id)).length
    }

    deckWinrates.global_winrate =  deck.wins.length / deck.games.length
    return deckWinrates
  }
}