export class PresetMenu {
  id!: number;
  name!: string;
  description: string = '';
  items: string = '[]';
  imageBase64: string = '';
  isActive: boolean = true;
  createdAt!: Date;
}
