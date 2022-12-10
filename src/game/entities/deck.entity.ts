import { Player } from 'src/game/entities/player.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deck extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  archidektId: string

  @Column()
  name: string

  @Column()
  commander: string

  @ManyToOne(() => Player, player => player.decks)
  owner: Player
}