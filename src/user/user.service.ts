import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoleEnum } from "src/auth/entities/enum/role.enum";
import { Role } from "src/auth/entities/role.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  
  async create(createUserDto: CreateUserDto) {
    const user = await User.findOneBy({ email: createUserDto.email })
    
    if (user) {
      throw new HttpException(
        "This user already exists",
        HttpStatus.BAD_REQUEST
      )
    }

    createUserDto.email = createUserDto.email.toLocaleLowerCase();

    const new_user = User.create<User>(createUserDto);

    const baseRole = await Role.findOneBy({roleLabel : RoleEnum.User});
    
    new_user.role = [baseRole];

    await new_user.save();

    delete new_user.password;
    return new_user;
  }

  async findOneById(id: number) {
    return User.findOneBy({
      id
    });
  }

  async findOneByPlayerId(playerId: number) {
    return User.createQueryBuilder("user")
    .leftJoin("user.players", "players")
    .where("players.id = :id", {id: playerId})
    .getOne()
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOneBy({
      email: email.toLocaleLowerCase()
    });
  }

  getAll() {
    return User.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await User.findOneBy({ id: id});
    Object.assign(user, updateUserDto);

    return user.save();
  }


}