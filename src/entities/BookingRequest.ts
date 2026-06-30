import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('booking_requests')
export class BookingRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ default: '' })
  email!: string;

  @Column({ default: '' })
  eventType!: string;

  @Column({ default: '' })
  eventDate!: string;

  @Column({ type: 'integer', nullable: true })
  estimatedGuests?: number | null;

  @Column({ default: '' })
  preferredPackage!: string;

  @Column({ default: '' })
  fulfilmentType!: string;

  @Column({ default: '' })
  notes!: string;

  @Column()
  status: string = 'Pending';

  @CreateDateColumn()
  createdAt!: Date;
}
