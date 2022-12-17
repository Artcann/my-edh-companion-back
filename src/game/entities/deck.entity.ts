import { Player } from 'src/game/entities/player.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from './game.entity';

@Entity()
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column({nullable: true})
  archidektId: string

  @Column()
  name: string

  @Column()
  commander: string

  @ManyToOne(() => Player, player => player.decks, {cascade: true})
  owner: Player

  @OneToMany(() => Game, game => game.winner)
  wins: Game[]

  @ManyToMany(() => Game, game => game.players, {eager: true})
  games: Game[]
}