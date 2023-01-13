import { Pod } from './pod.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deck } from 'src/decks/entities/deck.entity';

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  numberOfPlayers: number

  @Column()
  name: string

  @Column({ type: "timestamp" })
  date: Date

  @ManyToOne(() => Pod, pod => pod.games, {cascade: true})
  pod: Pod

  @ManyToMany(() => Deck, deck => deck.games, {cascade: true})
  @JoinTable()
  players: Deck[]

  @ManyToOne(() => Deck, deck => deck.wins)
  winner: Deck

  @BeforeInsert()
  async setExpirationDate() {
    let date = new Date();
    this.date = date;
  }
}