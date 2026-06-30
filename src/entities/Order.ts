import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderRef!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  fulfilmentType!: string;

  @Column()
  deliveryAddress!: string;

  @Column()
  dateNeeded!: string;

  @Column()
  timeNeeded!: string;

  @Column()
  notes!: string;

  @Column()
  originalAmount!: number;

  @Column()
  discountAmount!: number;

  @Column()
  totalAmount!: number;

  @Column()
  couponApplied!: string;

  @Column()
  status: string = 'Pending';

  @Column('simple-json')
  orderItems: OrderItem[] = [];

  @CreateDateColumn()
  createdAt!: Date;
}
