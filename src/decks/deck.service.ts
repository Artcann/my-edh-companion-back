import { Injectable } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { Deck } from "./entities/deck.entity";
import { Player } from "../game/entities/player.entity";

@Injectable()
export class DeckService {
  async create(createDeckDto: CreateDeckDto) {
    const deck = Deck.create<Deck>(createDeckDto);
    const owner = await Player.findOneBy({ id: createDeckDto.ownerId });
/*     if (owner.decks === undefined) {
      owner.decks = [];
    }

    owner.decks.push(deck);
    owner.save(); */

    deck.player_owner = owner;

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
}