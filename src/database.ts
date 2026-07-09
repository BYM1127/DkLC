import { setServers } from 'dns';
import { Collection, Db, Filter, MongoClient } from 'mongodb';
import { ContactMessage, QuoteRequest, BlockedDate, MenuItem, GalleryImage, SiteSettings } from './entities';

type EntityCtor<T> = new () => T;
type FindOptions<T> = {
  where?: Partial<T>;
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
};

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const mongoDbName = process.env.MONGODB_DB || 'dimpho_ke_lesego_catering';
const mongoConnectTimeoutMs = Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 3000);
const mongoServerSelectionTimeoutMs = Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 3000);
const mongoDnsServers = process.env.MONGODB_DNS_SERVERS;

if (mongoDnsServers) {
  setServers(mongoDnsServers.split(',').map(server => server.trim()).filter(Boolean));
}

const collectionNames = new Map<Function, string>([
  [ContactMessage, 'contact_messages'],
  [QuoteRequest, 'quote_requests'],
  [BlockedDate, 'blocked_dates'],
  [MenuItem, 'menu_items'],
  [GalleryImage, 'gallery_images'],
  [SiteSettings, 'site_settings'],
]);

let client: MongoClient | null = null;
let database: Db | null = null;
let databaseReady = false;

class MongoRepository<T extends { id?: number; createdAt?: Date }> {
  constructor(
    private readonly entityCtor: EntityCtor<T>,
    private readonly collectionName: string
  ) {}

  create(data: Partial<T>): T {
    return Object.assign(new this.entityCtor(), data);
  }

  async find(options?: FindOptions<T>): Promise<T[]> {
    const cursor = this.collection.find(this.toFilter(options?.where));

    if (options?.order) {
      cursor.sort(this.toSort(options.order));
    }

    const docs = await cursor.toArray();
    return docs.map(doc => this.hydrate(doc));
  }

  async findOne(options: FindOptions<T>): Promise<T | null> {
    const doc = await this.collection.findOne(this.toFilter(options.where));
    return doc ? this.hydrate(doc) : null;
  }

  async save(entity: T | T[]): Promise<T | T[]> {
    if (Array.isArray(entity)) {
      const saved: T[] = [];
      for (const item of entity) {
        saved.push(await this.saveOne(item));
      }
      return saved;
    }

    return this.saveOne(entity);
  }

  private async saveOne(entity: T): Promise<T> {
    const now = new Date();

    if (!entity.id) {
      entity.id = await nextSequence(this.collectionName);
    }

    if (!entity.createdAt) {
      entity.createdAt = now;
    }

    const doc = this.toDocument(entity);
    await this.collection.updateOne({ id: entity.id } as Filter<T>, { $set: doc }, { upsert: true });
    return entity;
  }

  private get collection(): Collection<T> {
    if (!database) {
      throw new Error('Database has not been initialized.');
    }

    return database.collection<T>(this.collectionName);
  }

  private hydrate(doc: any): T {
    const { _id, ...data } = doc;
    return Object.assign(new this.entityCtor(), data);
  }

  private toDocument(entity: T): any {
    const { _id, ...doc } = entity as any;
    return doc;
  }

  private toFilter(where?: Partial<T>): Filter<T> {
    if (!where) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined && value !== null)
    ) as Filter<T>;
  }

  private toSort(order: Partial<Record<keyof T, 'ASC' | 'DESC'>>): Record<string, 1 | -1> {
    return Object.fromEntries(
      Object.entries(order).map(([field, direction]) => [field, direction === 'DESC' ? -1 : 1])
    );
  }
}

const nextSequence = async (name: string): Promise<number> => {
  if (!database) {
    throw new Error('Database has not been initialized.');
  }

  const result = await database.collection('counters').findOneAndUpdate(
    { _id: name } as any,
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return result?.seq || 1;
};

export const AppDataSource = {
  get isInitialized(): boolean {
    return databaseReady;
  },

  async initialize(): Promise<void> {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is required. Add your MongoDB Atlas connection string in Netlify environment variables.');
    }

    if (!client) {
      client = new MongoClient(mongoUri, {
        connectTimeoutMS: mongoConnectTimeoutMs,
        serverSelectionTimeoutMS: mongoServerSelectionTimeoutMs,
      });
      try {
        await client.connect();
        database = client.db(mongoDbName);
        databaseReady = true;
      } catch (error) {
        client = null;
        throw error;
      }
    }
  },

  getRepository<T extends { id?: number; createdAt?: Date }>(entityCtor: EntityCtor<T>): MongoRepository<T> {
    const collectionName = collectionNames.get(entityCtor);

    if (!collectionName) {
      throw new Error(`No MongoDB collection configured for ${entityCtor.name}`);
    }

    return new MongoRepository(entityCtor, collectionName);
  },
};

const seedDatabase = async () => {
  const settingsRepo = AppDataSource.getRepository(SiteSettings);
  const existingSettings = await settingsRepo.find();

  if (existingSettings.length === 0) {
    await settingsRepo.save(settingsRepo.create({
      aboutText: 'Dimpho ke Lesego Catering brings refined, home-cooked South African cuisine to your weddings, milestone celebrations, memorials and private gatherings, from Phaphadi, Limpopo, (Mamaila Village), to your table.',
      contactPhone: '+27 79 692 9591',
      contactEmail: '',
      address: 'Phaphadi, Mamaila Village, 0832',
      deliveryAreas: 'Limpopo, Gauteng',
      hoursOfOperation: 'Mon-Sat: 08:00 - 17:00, Sun: Closed'
    }));
    console.log('Seeded initial site settings');
  }

  const menuRepo = AppDataSource.getRepository(MenuItem);
  const existingMenu = await menuRepo.find();
  
  if (existingMenu.length === 0) {
    await menuRepo.save([
      menuRepo.create({ name: 'Traditional Beef Stew', description: 'Slow-cooked beef stew with carrots and potatoes, served with pap.', price: 85, category: 'Mains', imageBase64: '', isActive: true }),
      menuRepo.create({ name: 'Grilled Quarter Chicken', description: 'Flame-grilled quarter chicken with our signature basting, served with a side of chakalaka.', price: 75, category: 'Mains', imageBase64: '', isActive: true }),
      menuRepo.create({ name: 'Creamy Spinach & Butternut', description: 'Fresh spinach cooked in a creamy sauce, paired with roasted butternut.', price: 45, category: 'Sides', imageBase64: '', isActive: true }),
      menuRepo.create({ name: 'Malva Pudding', description: 'Warm traditional South African dessert served with custard.', price: 55, category: 'Desserts', imageBase64: '', isActive: true }),
    ]);
    console.log('Seeded initial menu items');
  }

  const galleryRepo = AppDataSource.getRepository(GalleryImage);
  const existingGallery = await galleryRepo.find();

  if (existingGallery.length === 0) {
    await galleryRepo.save([
      galleryRepo.create({ eventName: 'Limpopo Traditional Wedding', description: 'Catering for 200 guests with a full traditional menu.', imageBase64: '' }),
      galleryRepo.create({ eventName: 'Corporate Year-End Function', description: 'Buffet setup for a corporate event in Gauteng.', imageBase64: '' }),
      galleryRepo.create({ eventName: 'Family Reunion Picnic', description: 'Outdoor catering setup with spitbraai and salads.', imageBase64: '' }),
    ]);
    console.log('Seeded initial gallery images');
  }
};

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Connecting to MongoDB Atlas database', mongoDbName);
      await AppDataSource.initialize();
      console.log('Database connection established');
      await seedDatabase();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
