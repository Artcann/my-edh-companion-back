import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    roleLabel: string;

    @ManyToMany(() => User)
    @JoinColumn()
    user: User[];
}