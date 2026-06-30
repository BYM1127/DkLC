import { DataSource, DataSourceOptions } from 'typeorm';
import { ContactMessage, BookingRequest, Order, Coupon, BlockedDate } from './entities';
import { isServerlessRuntime } from './runtime';

const configuredDbPath = process.env.DB_PATH;
const databaseUrl = process.env.DATABASE_URL;
const entities = [ContactMessage, BookingRequest, Order, Coupon, BlockedDate];
const isServerless = isServerlessRuntime();

const createDataSourceOptions = (): DataSourceOptions => {
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      synchronize: true,
      logging: false,
      entities,
    };
  }

  if (isServerless) {
    throw new Error('DATABASE_URL is required on Netlify so orders are saved permanently.');
  }

  return {
    type: 'sqlite',
    database: configuredDbPath || 'data/dimpho_catering.sqlite',
    synchronize: true,
    logging: false,
    entities,
  };
};

export const AppDataSource = new DataSource(createDataSourceOptions());

const describeDatabaseTarget = (): string => {
  if (databaseUrl) {
    return 'Postgres database from DATABASE_URL';
  }

  const options = AppDataSource.options;

  if (options.type === 'sqlite') {
    return `SQLite database at ${options.database}`;
  }

  return `${options.type} database`;
};

const initialCoupons = [
  { code: 'WELCOME10', discountType: 'Percentage', value: 10, isActive: true },
  { code: 'DKL50', discountType: 'Fixed', value: 50, isActive: true },
];

const seedInitialCoupons = async () => {
  const couponRepo = AppDataSource.getRepository(Coupon);
  const existingCoupons = await couponRepo.find();

  if (existingCoupons.length === 0) {
    await couponRepo.save(initialCoupons);
    console.log('Seeded initial coupons');
  }
};

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Connecting to', describeDatabaseTarget());
      await AppDataSource.initialize();
      console.log('Database connection established');
      await seedInitialCoupons();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
