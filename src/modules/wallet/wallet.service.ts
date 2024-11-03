import { Injectable } from '@nestjs/common';
import { DepositeDto } from './dto/wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository, DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { WalletType } from './wallet.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async deposit(depositeDto: DepositeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { amount, fullName, mobile } = depositeDto;
      const user = this.userService.createUser({ fullName, mobile });
      const userData = await queryRunner.manager.findOneBy(User, {
        id: (await user).id,
      });
      const newBalance = userData.balance + amount;
      await queryRunner.manager.update(
        User,
        { id: (await user).id },
        { balance: newBalance },
      );
      await queryRunner.manager.insert(Wallet, {
        amount,
        type: WalletType.Deposite,
        invoice_number: Date.now().toString(),
        userId: (await user).id,
      });
      //commit
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      //rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
    return {
      message: 'Deposite successfully',
    };
  }
}
