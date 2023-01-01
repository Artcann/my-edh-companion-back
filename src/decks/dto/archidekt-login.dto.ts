import { IsEmail } from "class-validator";

export class ArchidektLoginDto {
  @IsEmail()
  email: string
  password: string
}