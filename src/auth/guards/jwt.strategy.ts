import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log(process.env.JWT_SECRET)
    const user = await User.findOne(payload.sub);
    return { userId: payload.sub, username: payload.username,
      email: payload.email, roles: user.role};
  }
}