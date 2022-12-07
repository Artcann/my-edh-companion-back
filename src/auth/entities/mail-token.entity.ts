import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column({ type: "timestamp"})
  expiredAt: Date;

  @BeforeInsert()
  async setExpirationDate() {
    let date = new Date();
    date.setHours(date.getHours() + 1)
    this.expiredAt = date;
  }
}