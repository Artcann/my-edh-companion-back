import { User } from './../../user/entities/user.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  @JoinColumn({name: "userId"})
  user: User

  @OneToMany(() => Deck, deck => deck.player_owner, {eager: true})
  decks: Deck[]

  @ManyToOne(() => Pod, pod => pod.players)
  pod: Pod

  @Column({name: "userId", nullable: true})
  userId: number
}