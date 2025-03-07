import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders/orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();