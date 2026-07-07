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
  ingredientSourcing: string = 'DkLC Provides';
  staffHourlyRate: number = 0;
  estimatedHours: number = 0;
  status: string = 'Pending';
  createdAt!: Date;
}
