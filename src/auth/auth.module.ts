import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './guards/access-token.strategy';
import { RefreshTokenStrategy } from './guards/refresh-token.strategy';
import { LocalStrategy } from './guards/local.strategy';

@Module({
  imports: [UserModule,
            PassportModule,
            JwtModule.register({
              secret: process.env.JWT_SECRET,
            })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
