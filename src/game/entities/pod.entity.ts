import { Game } from './game.entity';
import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pod extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number

  @Column()
  name: string

  @OneToMany(() => Game, game => game.pod)
  games: Game[]
}