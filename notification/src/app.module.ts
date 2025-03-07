import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaConsumerService } from './consumer.service';
import { NodemailerService } from './nodemailer.service';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [
    AppService,
    KafkaConsumerService,
    NodemailerService,
  ],
})
export class AppModule {}
