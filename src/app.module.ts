import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { WalletModule } from './module/wallet/wallet.module';

@Module({
  imports: [UserModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
