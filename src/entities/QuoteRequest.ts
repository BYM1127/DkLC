export class QuoteRequest {
  id!: number;
  name!: string;
  phone!: string;
  email: string = '';
  eventType: string = '';
  dateNeeded: string = '';
  guestCount: number = 0;
  notes: string = '';
  venueLocation: string = '';
  providerType: string = '';
  selectedMenu: string = '';
  status: string = 'Pending';
  createdAt!: Date;
}
