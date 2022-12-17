import { Exclude } from "class-transformer";
import { Role } from "src/auth/entities/role.entity";
import * as bcrypt from "bcryptjs"
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Player } from "src/game/entities/player.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Exclude()
    @ManyToMany(() => Role, {cascade: true, eager: true})
    @JoinTable()
    role: Role[];

    @OneToMany(() => Player, player => player.user)
    players: Player[]

    @BeforeInsert()
    async hashPassword() {
      if(this.password) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}