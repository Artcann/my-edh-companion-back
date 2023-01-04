import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { RoleEnum } from './entities/enum/role.enum';
import { Token } from './entities/mail-token.entity';
import { Role } from './entities/role.entity';
import { createTransport } from 'nodemailer';

import * as bcrypt from "bcryptjs";

var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});

@Injectable()
export class AuthService {
    
  private transporter;

  constructor(private jwtService: JwtService, private userService: UserService) {
    this.transporter = createTransport({
      SES: new AWS.SES(),
    });
  }

  async login(user: User) {
    const tokens = this.getTokens(user.id, user.email)

    return tokens;
  }

  async mailLogin(emailVerificationDto: EmailVerificationDto) {
    const user = await this.userService.findOne(emailVerificationDto.email.toLocaleLowerCase());
    const verifiedRole = await Role.findOneBy({roleLabel : RoleEnum.VerifiedUser});

    if(!(user.role.includes(verifiedRole))) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else {
      const payload = { email: emailVerificationDto.email.toLocaleLowerCase() };
      return this.getTokens(user.id, user.email)
    }
    
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email.toLocaleLowerCase());

    if (!user) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "User not found"
      })
    } else if (!(user.role.some(e => e.roleLabel === RoleEnum.VerifiedUser))){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Your account is not verified"
      })
    } else if (user && await user.validatePassword(pass) && (user.role.some(e => e.roleLabel === RoleEnum.VerifiedUser))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 8);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );


    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async sendVerificationMail(user: User, token: Token) {

    const confirmationLink = process.env.BASE_URL + "auth/confirmation/" + token.token

    try {
      await this.transporter.verify();

      await this.transporter.sendMail({
        from: `art.cann@orange.fr`,
        to: user.email,
        subject: "Your Sign-In Link",
        text: `Hi there,
    
        This is your sign-in link: ${confirmationLink}
        
        This link will expire in 1 hour.
        
        For security reasons, you shouldn't reply to this email.`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}