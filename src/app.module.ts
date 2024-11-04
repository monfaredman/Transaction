import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), UserModule, WalletModule],
})
export class AppModule {}
