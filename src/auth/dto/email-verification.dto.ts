import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}