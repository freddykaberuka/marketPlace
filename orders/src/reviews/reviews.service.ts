import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './interfaces/review.interface'; // Import the Review interface

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(dto: CreateReviewDto): Promise<Review> {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed orders can be reviewed');
    }

    return this.prisma.review.create({ data: dto });
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({ where: { userId } });
  }
}
