import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
import { forwardRef } from "@nestjs/common/utils";
import { rejects } from "assert";
import { stat } from "fs";
import { RoleEnum } from "src/auth/entities/enum/role.enum";
import { Role } from "src/auth/entities/role.entity";
import { ArchidektService } from "src/decks/archidekt.service";
import { DeckService } from "src/decks/deck.service";
import { DeckStatsDTO } from "src/decks/dto/deck-stats.dto";
import { In } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  
  constructor(
    @Inject(forwardRef(() => DeckService))
    private deckService: DeckService,
    private archidektService: ArchidektService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await User.findOneBy({ email: createUserDto.email })
    
    if (user) {
      throw new HttpException(
        "This user already exists",
        HttpStatus.BAD_REQUEST
      )
    }

    createUserDto.email = createUserDto.email.toLocaleLowerCase();

    const new_user = User.create<User>(createUserDto);

    const baseRole = await Role.findOneBy({roleLabel : RoleEnum.User});
    
    new_user.role = [baseRole];

    await new_user.save();

    delete new_user.password;
    return new_user;
  }

  async findOneById(id: number) {
    return User.findOneBy({
      id
    });
  }

  async findOneByPlayerId(playerId: number) {
    return User.createQueryBuilder("user")
    .leftJoin("user.players", "players")
    .where("players.id = :id", {id: playerId})
    .getOne()
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOneBy({
      email: email.toLocaleLowerCase()
    });
  }

  getAll() {
    return User.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await User.findOneBy({ id: id});
    Object.assign(user, updateUserDto);

    return user.save();
  }

  async getUserStats(userId: number) {
    const decks = (await this.deckService.getDecksOfUser(userId)).filter(deck => deck.archidektId !== null)
    
    let stats = {
      ccm: 0, 
      salt: 0, 
      total_cards: 0, 
      colors: {red: 0, blue: 0, black: 0, white:0, green: 0},
      number_of_games: 0,
      number_of_decks: 0,
      number_of_pods: 0,
      winrate: 0
    }

    const user = await User.createQueryBuilder("user")
    .leftJoinAndSelect("user.players", "players")
    .leftJoinAndSelect("players.decks", "decks")
    .leftJoinAndSelect("players.pod", "pod")
    .leftJoinAndSelect("decks.games", "games")
    .where("user.id = :id", {id: userId})
    .getOne()
    
    console.log(user.players)

    stats.number_of_decks = user.players.reduce((total, current) => total + current.decks.length, 0)
    stats.number_of_games = user.players.reduce((total, current) => total + current.decks.reduce((total, current) => total + current.games.length, 0), 0)
    stats.number_of_pods = user.players.map(player => player.pod).filter((value, index, self) => self.findIndex(pod => pod.id === value.id) === index).length

    let totalPlayedGames = 0;
    let totalWonGames = 0

    user.players.map(player => {
      totalPlayedGames += player.decks.reduce((total, current) => total + current.games.length, 0)
      totalWonGames += player.decks.reduce((total, current) => {
        if(current.wins !== undefined) return total + current.wins.length
        else return 0
      }, 0)
    })
  
    stats.winrate = totalWonGames / totalPlayedGames

    await Promise.all(decks.map(async deck => {
      const deckStats = await this.archidektService.fetchDeckStats(deck.archidektId)
      stats.ccm += deckStats.ccm
      stats.salt += deckStats.salt
      stats.total_cards += deckStats.total_cards
      Object.keys(stats.colors).forEach(key => {
        stats.colors[key] += deckStats.colors[key]
      })
    }))

    stats.ccm = Number((stats.ccm / decks.length).toFixed(2))
    stats.salt = Number((stats.salt / decks.length).toFixed(2))
    stats.total_cards = Number((stats.total_cards / decks.length).toFixed(2))

    return stats
  }


}