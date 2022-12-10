import { Game } from './game.entity';
import { User } from './../../user/entities/user.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deck } from './deck.entity';

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, user => user.players)
  user: User

  @ManyToMany(() => Game, game => game.players)
  games: Game[]

  @OneToMany(() => Deck, deck => deck.owner)
  decks: Deck[]
}