import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProxyMiddleware } from './middleware/proxy.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
