import { IConstants } from '../interfaces/constants.interface';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export function constants(): IConstants {
  return {
    port: Number(process.env.PORT) || 4000,
    brokerUrl: process.env.BROKER_URL || 'kafka_broker:9092',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || '',
  };
}
