import { Injectable } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { Deck } from "./entities/deck.entity";
import { Player } from "../game/entities/player.entity";
import { User } from "src/user/entities/user.entity";

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
}