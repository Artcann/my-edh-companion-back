import { IsEmail } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;

  username: string;
}