export class Coupon {
  id!: number;
  code!: string;
  discountType!: string;
  value!: number;
  isActive: boolean = true;
}
