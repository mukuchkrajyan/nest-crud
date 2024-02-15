import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'nestjs_crud',
      entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
      synchronize: true,
    }),
    ProductModule, // Добавление ProductModule
  ],

})
export class AppModule {}
