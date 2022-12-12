import { Pod } from './pod.entity';
import { Player } from './player.entity';
import { Exclude } from "class-transformer";
import { timestamp } from "rxjs";
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToMany(() => Player, player => player.games)
  @JoinTable()
  players: Player[]

  @BeforeInsert()
  async setExpirationDate() {
    let date = new Date();
    this.date = date;
  }
}