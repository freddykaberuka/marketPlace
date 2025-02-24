import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create product
  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Get all products
  async findAll() {
    return await this.prisma.product.findMany();
  }

  // Get a single product by ID
  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Update product
  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // Delete product
  async remove(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
