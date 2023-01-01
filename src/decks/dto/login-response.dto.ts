import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ArchidektUserDTO } from './archidekt-user.dto';
export class LoginResponseDto {
  access_token: string
  refresh_token: string
  @ValidateNested()
  @Type(() => ArchidektUserDTO)
  user: ArchidektUserDTO
}