import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions,FindOptionsOrder } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
  }

  private products: ProductEntity[] = [];

  async getAllProducts(sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'DESC'): Promise<ProductEntity[]> {
    // Define options for find method
    const options: FindManyOptions<ProductEntity> = {};

    // Apply sorting if sortBy parameter is provided
    if (sortBy) {
      const order: FindOptionsOrder<ProductEntity> = {};
      order[sortBy] = sortOrder;
      options.order = order;
    }

    // Fetch products from the database with applied sorting
    return await this.productRepository.find(options);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async createProduct(productDTO: ProductDTO): Promise<ProductEntity> {

    const newProduct = this.productRepository.create(productDTO);

    console.log('newProduct', newProduct);

    const savedProduct = await this.productRepository.save(newProduct);

    console.log('savedProduct', savedProduct);
    return savedProduct;
  }

  async updateProduct(id: number, productDTO: ProductDTO): Promise<ProductEntity> {
    // Find the existing product entity in the database
    const existingProduct = await this.productRepository.findOne({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Update the properties of the existing product entity with new data
    existingProduct.name = productDTO.name;
    existingProduct.price = productDTO.price;

    // Save the updated product entity back to the database
    return this.productRepository.save(existingProduct);
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const result = await this.productRepository.delete(id);
      return result.affected > 0; // Returns true if a row was affected (deleted)
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}
