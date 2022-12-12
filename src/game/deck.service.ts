import { Injectable } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { Deck } from "./entities/deck.entity";
import { Player } from "./entities/player.entity";

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

    deck.owner = owner;

    return deck.save();
  }
}