import { Collection, Db, Filter, MongoClient } from 'mongodb';
import { ContactMessage, BookingRequest, Order, Coupon, BlockedDate } from './entities';

type EntityCtor<T> = new () => T;
type FindOptions<T> = {
  where?: Partial<T>;
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
};

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const mongoDbName = process.env.MONGODB_DB || 'dimpho_ke_lesego_catering';

const collectionNames = new Map<Function, string>([
  [ContactMessage, 'contact_messages'],
  [BookingRequest, 'booking_requests'],
  [Order, 'orders'],
  [Coupon, 'coupons'],
  [BlockedDate, 'blocked_dates'],
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
        tls: true,
        tlsAllowInvalidCertificates: false,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      });
      await client.connect();
      database = client.db(mongoDbName);
      databaseReady = true;
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

const initialCoupons = [
  { code: 'WELCOME10', discountType: 'Percentage', value: 10, isActive: true },
  { code: 'DKL50', discountType: 'Fixed', value: 50, isActive: true },
];

const seedInitialCoupons = async () => {
  const couponRepo = AppDataSource.getRepository(Coupon);
  const existingCoupons = await couponRepo.find();

  if (existingCoupons.length === 0) {
    await couponRepo.save(initialCoupons.map(coupon => couponRepo.create(coupon)));
    console.log('Seeded initial coupons');
  }
};

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Connecting to MongoDB Atlas database', mongoDbName);
      await AppDataSource.initialize();
      console.log('Database connection established');
      await seedInitialCoupons();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
