import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  deposit(@Body() depositDto: DepositDto) {
    return this.walletService.deposit(depositDto);
  }
  @Post('withdraw')
  withdraw(@Body() withdrawDto: WithdrawDto) {
    return this.walletService.paymentByWallet(withdrawDto);
  }
}
