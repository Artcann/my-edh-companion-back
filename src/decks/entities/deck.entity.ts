import { Player } from 'src/game/entities/player.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/user/entities/user.entity';
import { Game } from 'src/game/entities/game.entity';


@Entity()
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column({nullable: true})
  archidektId: string

  @Column()
  name: string

  @Column({nullable: true})
  commander: string

  @Column({nullable: true})
  featured: string

  @ManyToOne(() => Player, player => player.decks, {cascade: true, nullable: true})
  player_owner: Player

  @ManyToOne(() => User, user => user.archidekt_decks, {nullable: true})
  user_owner: User

  @OneToMany(() => Game, game => game.winner)
  wins: Game[]

  @ManyToMany(() => Game, game => game.players, {eager: true})
  games: Game[]
}