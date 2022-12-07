import { Exclude } from "class-transformer";
import { Role } from "src/auth/entities/role.entity";
import * as bcrypt from "bcryptjs"
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

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