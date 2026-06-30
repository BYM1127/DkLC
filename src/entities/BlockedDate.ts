import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('blocked_dates')
export class BlockedDate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: string; // ISO Date string e.g. "2026-07-15"
}
