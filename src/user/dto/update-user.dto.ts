import { IsEmail, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  password?: string;

  username?: string;

  refreshToken?: string

  archidektUsername?: string
}