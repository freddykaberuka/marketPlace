import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as httpProxy from 'http-proxy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);
  private readonly proxy = httpProxy.createProxyServer();
  private readonly serviceMap: Record<string, string>;

  constructor(private readonly configService: ConfigService) {
    // Use environment variables for service URLs
    this.serviceMap = {
      '/api/auth': 'http://auth-service:4000/auth',
      '/api/product': 'http://product-service:5000/products',
    };
     
  }

  use(req: Request, res: Response, next: NextFunction) {
    const matchedPath = Object.keys(this.serviceMap).find((key) => req.path.startsWith(key));
  
    if (matchedPath) {
      const target = this.serviceMap[matchedPath];
      const newPath = req.path.replace(matchedPath, '');
  
      this.logger.log(`Proxying request to: ${target}${newPath}`);
      
      this.proxy.web(req, res, { target: `${target}${newPath}`, changeOrigin: true }, (err) => {
        this.logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({ message: 'Service unavailable' });
      });
    } else {
      this.logger.warn(`No matching service found for path: ${req.path}`);
      next();
    }
  }  
  
}