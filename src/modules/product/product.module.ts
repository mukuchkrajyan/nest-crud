import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), // Добавьте эту строку для использования репозитория ProductEntity
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}