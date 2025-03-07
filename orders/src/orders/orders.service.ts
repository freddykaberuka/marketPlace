import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const totalPrice = dto.quantity * product.price;

    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: { 
          userId: dto.userId,
          productId: dto.productId,
          quantity: dto.quantity,
          totalPrice,
          status: OrderStatus.PENDING
        },
        include: { product: true },
      });

      await prisma.product.update({
        where: { id: dto.productId },
        data: { stock: product.stock - dto.quantity },
      });

      return order;
    });
  }

  async findOrdersByUser(userId: string, skip: number = 0, take: number = 10): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
      skip,
      take,
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}