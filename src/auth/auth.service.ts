import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { RoleEnum } from './entities/enum/role.enum';
import { Token } from './entities/mail-token.entity';
import { Role } from './entities/role.entity';

import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
    
  private transporter;

  constructor(private jwtService: JwtService, private userService: UserService) {
    //this.generateTransporter();
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
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

/*   async sendVerificationMail(user: User, token: Token) {

    const htmlPath = user.language === LanguageEnum.FR
    ? './ressources/templates/mail-fr.html'
    : './ressources/templates/mail-en.html';

    const source = readFileSync(htmlPath, 'utf-8').toString();

    const templateVars = {
      name: user.first_name !== undefined ? user.first_name : "",
      comfirmLink: process.env.API_URL + "auth/confirmation/" + token.token
    }

    const template = ejs.render(source, templateVars);
    const text = htmlToText(template);

    const htmlWithStyle = juice(template);

    try {
      await this.transporter.verify();

      await this.transporter.sendMail({
        from:{
          name: "Liste GRAVITY",
          address: "respo@tech.liste-gravity.fr"},
        to: user.email,
        subject: "Verification Mail",
        text: text,
        html: htmlWithStyle
      })
    } catch (err) {
      console.error(err);
    }
  }

  async generateTransporter() {
    const MAIL = "arthur.cann.29@gmail.com"

    const oauth2Client = new google.auth.OAuth2(
      process.env.MAILER_CLIENT_ID,
      process.env.MAILER_PRIVATE_KEY,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    const access_token = await oauth2Client.getAccessToken();

    this.transporter = await createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: MAIL,
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_PRIVATE_KEY,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: access_token
      },
    });
  } */
}