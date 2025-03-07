import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { NodemailerService } from './nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { OrderNotificationPayload } from './interfaces/notification.interface';

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown, OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly configService: ConfigService,
  ) {
    this.kafka = new Kafka({
      brokers: [this.configService.get<string>('BROKER_URL') || 'kafka_broker:9092'],
    });
  }

  async onApplicationShutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  async onModuleInit() {
    await this.consume();
  }

  async consume() {
    this.consumer = this.kafka.consumer({ groupId: 'notifications-consumer' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'orders.created' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        console.log(`Received order event: ${topic}, Partition: ${partition}`);

        const orderData: OrderNotificationPayload = JSON.parse(message.value.toString());

        await this.nodemailerService.sendEmail(
          orderData.userEmail,
          'Order Confirmation',
          'order-confirmation',
          orderData,
        );
      },
    });
  }
}
