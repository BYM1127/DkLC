import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('booking_requests')
export class BookingRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  eventType!: string;

  @Column()
  eventDate!: string;

  @Column()
  estimatedGuests!: number;

  @Column()
  preferredPackage!: string;

  @Column()
  fulfilmentType!: string;

  @Column()
  notes!: string;

  @Column()
  status: string = 'Pending';

  @CreateDateColumn()
  createdAt!: Date;
}
