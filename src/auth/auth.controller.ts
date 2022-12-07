import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus, NotFoundException} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RoleEnum } from './entities/enum/role.enum';
import { Token } from './entities/mail-token.entity';
import { Role } from './entities/role.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }
  
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
      console.log(createUserDto);
      const user = await this.userService.create(createUserDto);
      const token = Token.create({userId: user.id, token: randomBytes(16).toString('hex')});
      Token.save(token);
  
      //this.authService.sendVerificationMail(user, token);
  
      return user;

      
    }
  
    @Get('confirmation/:token')
    async confirmProfile(@Request() req) {
      const token = await Token.findOneBy({ token: req.params.token });
      const userId = token.userId;
      let user = await User.findOneBy({id: userId});
      if(!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: "User not found"
        })
      }
      const verifiedRole = await Role.findOneBy({roleLabel: RoleEnum.VerifiedUser});
      if(user.role.includes(verifiedRole)) {
        return "Your account is already activated"
      } else {
        user.role.push(verifiedRole);
        user.save();
    
        return "Your account has been activated";
      }
      
  
    }
  
    @Post('confirmation/resend/:mail')
    async resendMail(@Request() req) {
      const mail = req.params.mail;
      const user = await User.findOneBy({ email: mail});
      Token.delete({ userId: user.id });
  
      const token = Token.create({userId: user.id, token: randomBytes(16).toString('hex')});
      Token.save(token);
      
      //this.authService.sendVerificationMail(user, token);
  
      return "mail sent successfully";
    }
  
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
      const reponse = this.authService.login(req.user);

      const userEntity = await User.findOneBy({id: req.user.id});
  
      userEntity.save();

      return reponse;
    }
}
