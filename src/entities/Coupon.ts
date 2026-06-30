import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  discountType!: string; // "Percentage" or "Fixed"

  @Column()
  value!: number;

  @Column()
  isActive: boolean = true;
}
