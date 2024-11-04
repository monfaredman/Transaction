import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletType } from '../wallet.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'enum', enum: WalletType })
  type: string;
  @Column()
  invoice_number: string;
  @Column({ type: 'numeric' })
  amount: number;
  @Column()
  userId: number;
  @Column({ nullable: true })
  reason: string;
  @Column({ nullable: true })
  productId: number;
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'SET NULL' })
  user: User;
}
