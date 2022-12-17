import { Game } from './game.entity';
import { User } from './../../user/entities/user.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deck } from './deck.entity';
import { Pod } from './pod.entity';

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, user => user.players)
  user: User

  @OneToMany(() => Deck, deck => deck.owner, {eager: true})
  decks: Deck[]

  @ManyToOne(() => Pod, pod => pod.players)
  pod: Pod
}