import { Pod } from './pod.entity';
import { Player } from './player.entity';
import { Exclude } from "class-transformer";
import { timestamp } from "rxjs";
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deck } from './deck.entity';

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

  @ManyToOne(() => Pod, pod => pod.games)
  pod: Pod

  @ManyToMany(() => Deck, deck => deck.games)
  @JoinTable()
  players: Deck[]

  @OneToMany(() => Deck, deck => deck.wins)
  winner: Deck

  @BeforeInsert()
  async setExpirationDate() {
    let date = new Date();
    this.date = date;
  }
}