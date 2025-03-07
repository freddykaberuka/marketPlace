export interface Review {
    id: string;
    userId: string;
    orderId: string;
    rating: number;
    comment?: string | null;
    createdAt: Date;
  }
  