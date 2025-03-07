import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly authServiceUrl: string;
  private readonly productServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ?? 'http://localhost:3001';
    this.productServiceUrl =
      this.configService.get<string>('PRODUCT_SERVICE_URL') ?? 'http://localhost:3002';
  }

  async forwardRequest(service: string, method: string, endpoint: string, data?: any) {
    const baseUrl = service === 'auth' ? this.authServiceUrl : this.productServiceUrl;
    const url = `${baseUrl}/${endpoint}`;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
        }),
      );

      if (!response) {
        throw new Error('No response received from the service');
      }

      return response.data;
    } catch (error) {
      throw new Error(
        `Error forwarding request to ${service} service: ${error.message}`,
      );
    }
  }
}