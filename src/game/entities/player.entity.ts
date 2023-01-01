import { User } from './../../user/entities/user.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pod } from './pod.entity';
import { Deck } from 'src/decks/entities/deck.entity';

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  name: string

  @ManyToOne(() => User, user => user.players)
  user: User

  @OneToMany(() => Deck, deck => deck.player_owner, {eager: true})
  decks: Deck[]

  @ManyToOne(() => Pod, pod => pod.players)
  pod: Pod
}