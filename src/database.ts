import { DataSource } from 'typeorm';
import { ContactMessage, BookingRequest, Order, Coupon, BlockedDate } from './entities';
import { isServerlessRuntime } from './runtime';

const configuredDbPath = process.env.DB_PATH;
const dbPath =
  isServerlessRuntime() && (!configuredDbPath || configuredDbPath.startsWith('data/'))
    ? '/tmp/dimpho_catering.sqlite'
    : configuredDbPath || 'data/dimpho_catering.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [ContactMessage, BookingRequest, Order, Coupon, BlockedDate],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Connecting to SQLite database at', dbPath);
      await AppDataSource.initialize();
      console.log('Database connection established');
      
      // Seed initial coupons if they don't exist
      const couponRepo = AppDataSource.getRepository(Coupon);
      const existingCoupons = await couponRepo.find();
      
      if (existingCoupons.length === 0) {
        const coupons = [
          { code: 'WELCOME10', discountType: 'Percentage', value: 10, isActive: true },
          { code: 'DKL50', discountType: 'Fixed', value: 50, isActive: true },
        ];
        await couponRepo.save(coupons);
        console.log('Seeded initial coupons');
      }
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
