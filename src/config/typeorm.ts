import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'monfaredman',
    database: 'wallet',
    entities: [
      'dist/**/**/**/*.entity{.ts,.js}',
      'dist/**/**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    autoLoadEntities: false,
  };
}
