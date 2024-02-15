import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Render,
  Res,
  Req,
  Query,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { ProductDTO } from './dto/product.dto';
import { ProductEntity } from './entities/product.entity';
import { validate } from 'class-validator';
import { Response, Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {
  }

  @Get()
  @Render('products/index') // Render the 'index.ejs' view
  async getAllProducts(@Query('sortBy') sortBy: string = 'price', // Set default sortBy to 'name'
                       @Query('sortOrder') sortOrder: 'ASC' | 'DESC', @Req() req: Request): Promise<{
    errorMessage: any;
    successMessage: any;
    products: ProductEntity[],
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  }> {
    const products = await this.productService.getAllProducts(sortBy, sortOrder);

    // Получаем флэш-сообщения из объекта запроса
    const errorMessages = req.flash('error');
    const errorMessage = errorMessages.length > 0 ? errorMessages[0] : null;
    const successMessages = req.flash('success');
    const successMessage = successMessages.length > 0 ? successMessages[0] : null;

     return {
      products,
      errorMessage,
      successMessage,
      sortBy, // Include sortBy in the returned object
      sortOrder, // Include sortOrder in the returned object
    }; // Pass the array of products to the view
  }

  @Get('add')
  @Render('products/create')
  renderAddProduct(@Res() response): any {
    const errors = {}; // Define errors object as empty
    response.status(HttpStatus.BAD_REQUEST); // Set status to Bad Request
    return { productDTO: new ProductDTO(), errors }; // Return empty ProductDTO and errors
  }

  @Get('edit/:id') // Маршрут для редактирования продукта
  @Render('products/edit')
  async renderEditProduct(@Param('id') id: number) {
    const errors = {}; // Define errors object as empty
    const product = await this.productService.getProductById(id);

    return { product: product, productDTO: new ProductDTO(), errors }; // Return empty ProductDTO and errors
  }

  @Post('add')
  async createProduct(@Body() productDTO: ProductDTO, @Res() response) {
    try {
      await this.productService.createProduct(productDTO);
      response.redirect('/products');
    } catch (error) {
      if (error.response && error.response.message) {
        const errors = Array.isArray(error.response.message) ? error.response.message : [error.response.message];
        response.status(HttpStatus.BAD_REQUEST).render('products/create', { productDTO, errors }); // Отобразить представление create с ошибками
      } else {
        console.error('Ошибка создания продукта:', error);
        // response.status(HttpStatus.INTERNAL_SERVER_ERROR).render('error'); // Отобразить представление ошибки для других ошибок
      }
    }
  }

  private async validateProductDTO(productDTO: ProductDTO): Promise<string[]> {
    const errors = [];
    const validationErrors = await validate(productDTO);
    if (validationErrors.length > 0) {
      for (const error of validationErrors) {
        errors.push(Object.values(error.constraints)[0]);
      }
    }
    return errors;
  }

  // here must be changed to Put method for update
  @Post('update/:id') // Update the route to match the form action
  async updateProduct(@Param('id') id: number, @Body() productDTO: ProductDTO, @Req() req: Request, @Res() res: Response) {

    console.log("updateProduct");
    // Perform validation
    const errors = await validate(productDTO);

    console.log(errors);
    if (errors.length > 0) {
      req.flash('error', 'Please fix errors');

      res.redirect('/products');
    }

    try {
      req.flash('success', 'Updated successfully');

      await this.productService.updateProduct(id, productDTO);

      res.redirect('/products');
    } catch (error) {
      res.redirect('/products');
      console.error('Error updating product', error);
    }
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const deleted = await this.productService.deleteProduct(id);
      if (deleted) {
        req.flash('success', 'Deleted successfully');
      } else {
        req.flash('error', 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      req.flash('error', 'Failed to delete product');
    }
    res.redirect('/products');
  }

}