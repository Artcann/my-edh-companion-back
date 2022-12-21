import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus, NotFoundException, Req} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RoleEnum } from './entities/enum/role.enum';
import { Token } from './entities/mail-token.entity';
import { Role } from './entities/role.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }
  
  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const mail_token = Token.create({userId: user.id, token: randomBytes(16).toString('hex')});
    Token.save(mail_token);

    const tokens = await this.authService.getTokens(user.id, user.email);
    this.authService.updateRefreshToken(user.id, tokens.refreshToken)

    //this.authService.sendVerificationMail(user, token);

    return tokens;
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
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return await this.authService.login(req.user);

  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }
}
