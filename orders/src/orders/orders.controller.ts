import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':userId')
  findOrdersByUser(@Param('userId') userId: string) {
    return this.ordersService.findOrdersByUser(userId);
  }

  @Patch(':orderId/:status')
  updateStatus(@Param('orderId') orderId: string, @Param('status') status: string) {
    return this.ordersService.updateOrderStatus(orderId, status as OrderStatus);
  }

}