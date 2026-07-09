export class MenuItem {
  id!: number;
  name!: string;
  description: string = '';
  price!: number;
  category: string = 'Uncategorized';
  imageBase64: string = '';
  isActive: boolean = true;
  createdAt!: Date;
}
