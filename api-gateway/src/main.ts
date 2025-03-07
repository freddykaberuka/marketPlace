import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  // app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors();

  // Apply validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  Logger.log(`API Gateway running on http://localhost:${PORT}`, 'Bootstrap');
}
bootstrap();
