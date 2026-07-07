import { OrderItem } from './OrderItem';

export class Order {
  id!: number;
  orderRef!: string;
  accessToken: string = '';
  name!: string;
  phone!: string;
  email: string = '';
  fulfilmentType: string = '';
  deliveryAddress: string = '';
  dateNeeded: string = '';
  timeNeeded: string = '';
  notes: string = '';
  distanceKm: number = 0;
  deliveryFee: number = 0;
  paymentMethod: string = '';
  paymentStatus: string = 'Pending';
  originalAmount!: number;
  discountAmount!: number;
  totalAmount!: number;
  couponApplied: string = '';
  status: string = 'Pending';
  orderItems: OrderItem[] = [];
  createdAt!: Date;
}
