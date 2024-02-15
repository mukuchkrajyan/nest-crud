// product.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsNotEmpty()
  // @IsNumber()
  price: number;
}
