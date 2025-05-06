import { Product } from './product.interface';

export interface OrderDocument {
  id: string;
  items: Product[];
  paymentStatus: string;
  shippingStatus: string;
  dateOfOrder: number;
}
