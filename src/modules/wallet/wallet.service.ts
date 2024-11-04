import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepositDto } from './dto/wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository, DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { WalletType } from './wallet.enum';
import { ProductList } from '../products';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { amount, fullName, mobile } = depositDto;
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
        type: WalletType.Deposit,
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
      message: 'Deposit successfully',
    };
  }

  async paymentByWallet(withdrawDto) {
    const { productId, userId } = withdrawDto;
    const product = await ProductList.find(
      (product) => product.id === productId,
    );
    if (!product) throw new NotFoundException('Product not found');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneBy(User, {
        id: userId,
      });
      if (!user) throw new NotFoundException('User not found');
      if (user.balance < product.price)
        throw new NotFoundException('Insufficient balance');
      const newBalance = user.balance - product.price;
      await queryRunner.manager.update(
        User,
        { id: userId },
        { balance: newBalance },
      );
      await queryRunner.manager.insert(Wallet, {
        amount: product.price,
        reason: `buy product ${product.name}`,
        type: WalletType.Withdraw,
        productId,
        userId,
        invoice_number: Date.now().toString(),
      });
      //commit
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      //rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error?.statusCode) {
        throw new HttpException(error.message, error?.statusCode);
      }
      throw new BadRequestException(error.message);
    }
    return {
      message: 'Payment successfully',
    };
  }
}
