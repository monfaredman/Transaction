import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  fullName: string;
  @Column()
  mobile: string;
  @Column({ type: 'numeric', default: 0 })
  balance: number;
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  transactions: Wallet[];
  @CreateDateColumn()
  created_at: Date;
}
