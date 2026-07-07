export class BookingRequest {
  id!: number;
  accessToken: string = '';
  name!: string;
  phone!: string;
  email: string = '';
  eventType: string = '';
  eventDate: string = '';
  estimatedGuests?: number | null;
  preferredPackage: string = '';
  fulfilmentType: string = '';
  notes: string = '';
  ingredientSourcing: string = '';
  estimatedHours: number | null = null;
  staffHourlyRate: string = '';
  status: string = 'Pending';
  createdAt!: Date;
}
