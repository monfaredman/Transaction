import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeormConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'wallet',
    entities: [
      'dist/**/**/**/*.entity{.ts,.js}',
      'dist/**/**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoLoadEntities: false,
  };
}
