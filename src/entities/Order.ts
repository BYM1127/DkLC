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
  originalAmount!: number;
  discountAmount!: number;
  totalAmount!: number;
  couponApplied: string = '';
  status: string = 'Pending';
  orderItems: OrderItem[] = [];
  createdAt!: Date;
}
