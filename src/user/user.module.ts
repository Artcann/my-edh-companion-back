import { forwardRef, Module } from '@nestjs/common';
import { DecksModule } from 'src/decks/decks.module';
import { GameModule } from 'src/game/game.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
    imports: [forwardRef(() => DecksModule), GameModule]
})
export class UserModule {}
