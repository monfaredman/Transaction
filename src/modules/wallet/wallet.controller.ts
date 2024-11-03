import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositeDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  deposit(@Body() depositeDto: DepositeDto) {
    return this.walletService.deposit(depositeDto);
  }
}
