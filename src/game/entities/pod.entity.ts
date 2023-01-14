import { Player } from 'src/game/entities/player.entity';
import { Game } from './game.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(() => Game, game => game.pod, {eager: true})
  games: Game[]

  @OneToMany(() => Player, player => player.pod, {eager: true})
  players: Player[]
}