import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ProductsModule, CategoriesModule],
  providers: [PrismaService],
})
export class AppModule {}
