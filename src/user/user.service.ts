import { Injectable } from "@nestjs/common";
import { RoleEnum } from "src/auth/entities/enum/role.enum";
import { Role } from "src/auth/entities/role.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  
  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLocaleLowerCase();

    const user = User.create<User>(createUserDto);

    const baseRole = await Role.findOneBy({roleLabel : RoleEnum.User});
    
    user.role = [baseRole];

    await user.save();

    delete user.password;
    return user;
  }

  async findOneById(id: number) {
    return User.findOneBy({
      id
    });
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOneBy({
      email: email.toLocaleLowerCase()
    });
  }

  getAll() {
    return User.find();
  }

/*   async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await User.findOne(id);
    Object.assign(user, updateUserDto);
    return user.save();
  } */
}