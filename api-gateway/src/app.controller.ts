import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('gateway')
export class AppController {
  @Get('auth')
  @UseGuards(AuthGuard)
  async auth(@Req() req: Request, @Res() res: Response) {
    return res.send({ message: 'Authenticated route' });
  }

  @Get('products')
  async products(@Res() res: Response) {
    return res.send({ message: 'Product service proxy' });
  }
}
