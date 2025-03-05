import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, templateName: string, replacements: Record<string, any>) {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders dynamically
    for (const key in replacements) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
