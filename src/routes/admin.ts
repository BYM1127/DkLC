import { Router, Request, Response } from 'express';
import * as path from 'path';
import { AppDataSource } from '../database';
import { ContactMessage, BookingRequest, Order, Coupon, BlockedDate } from '../entities';
import { EmailService } from '../services/EmailService';
import { isServerlessRuntime } from '../runtime';

const router = Router();
const webRootPath = path.join(__dirname, '..', '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
const notificationService = new EmailService(webRootPath);

// Auth middleware
router.use((req, res, next) => {
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey && isServerlessRuntime()) {
    return res.status(503).json({ message: 'ADMIN_API_KEY is required before admin routes can be used.' });
  }

  if (!expectedKey) {
    return next();
  }

  const authHeader = req.header('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const suppliedKey = req.header('x-admin-api-key') || bearerToken;

  if (suppliedKey !== expectedKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
});

// === CONTACTS ===

// GET /api/admin/contacts
router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contacts = await contactRepo.find({
      order: { createdAt: 'DESC' },
    });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === BOOKINGS ===

// GET /api/admin/bookings
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const bookings = await bookingRepo.find({
      order: { createdAt: 'DESC' },
    });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/bookings/:id/status
router.put('/bookings/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const booking = await bookingRepo.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.status = status;
    await bookingRepo.save(booking);

    return res.status(200).json({ success: true, status: booking.status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === ORDERS ===

// GET /api/admin/orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      order: { createdAt: 'DESC' },
    });

    const formattedOrders = orders.map(o => ({
      id: o.id,
      orderRef: o.orderRef,
      name: o.name,
      phone: o.phone,
      email: o.email,
      fulfilmentType: o.fulfilmentType,
      deliveryAddress: o.deliveryAddress,
      dateNeeded: o.dateNeeded,
      timeNeeded: o.timeNeeded,
      notes: o.notes,
      originalAmount: o.originalAmount,
      discountAmount: o.discountAmount,
      totalAmount: o.totalAmount,
      couponApplied: o.couponApplied,
      status: o.status,
      createdAt: o.createdAt,
      items: o.orderItems.map(i => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        isPackage: i.isPackage,
      })),
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    await orderRepo.save(order);

    return res.status(200).json({ success: true, status: order.status });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === COUPONS ===

// GET /api/admin/coupons
router.get('/coupons', async (req: Request, res: Response) => {
  try {
    const couponRepo = AppDataSource.getRepository(Coupon);
    const coupons = await couponRepo.find({
      order: { id: 'ASC' },
    });
    return res.status(200).json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/coupons
router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const { code, discountType, value, isActive } = req.body;

    if (!code || value === undefined || value === null) {
      return res.status(400).json({ message: 'Code and value are required.' });
    }

    const couponRepo = AppDataSource.getRepository(Coupon);
    const existing = await couponRepo.findOne({ where: { code: code.trim().toUpperCase() } });
    if (existing) {
      return res.status(400).json({ message: 'A coupon with this code already exists.' });
    }

    const coupon = couponRepo.create({
      code: code.trim().toUpperCase(),
      discountType: discountType === 'Fixed' ? 'Fixed' : 'Percentage',
      value: value,
      isActive: isActive !== undefined ? isActive : true,
    });

    await couponRepo.save(coupon);
    return res.status(200).json({ success: true, id: coupon.id });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/coupons/:id/toggle
router.put('/coupons/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const couponRepo = AppDataSource.getRepository(Coupon);
    const coupon = await couponRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    coupon.isActive = !coupon.isActive;
    await couponRepo.save(coupon);

    return res.status(200).json({ success: true, isActive: coupon.isActive });
  } catch (error) {
    console.error('Error toggling coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/coupons/:id
router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const couponRepo = AppDataSource.getRepository(Coupon);
    const coupon = await couponRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    const deleted = await couponRepo.delete({ id: parseInt(id, 10) });
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete coupon.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === BLOCKED DATES ===

// GET /api/admin/availability/blocked-dates
router.get('/availability/blocked-dates', async (req: Request, res: Response) => {
  try {
    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const dates = await blockedDateRepo.find();
    return res.status(200).json(dates);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/availability/block
router.post('/availability/block', async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const existing = await blockedDateRepo.findOne({ where: { date } });
    if (existing) {
      return res.status(400).json({ message: 'Date is already blocked.' });
    }

    const blocked = blockedDateRepo.create({ date });
    await blockedDateRepo.save(blocked);

    return res.status(200).json({ success: true, date });
  } catch (error) {
    console.error('Error blocking date:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/availability/block/:date
router.delete('/availability/block/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const blocked = await blockedDateRepo.findOne({ where: { date } });

    if (!blocked) {
      return res.status(404).json({ message: 'Blocked date not found.' });
    }

    const deleted = await blockedDateRepo.delete({ date });
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to unblock date.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error unblocking date:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === WHATSAPP ===

// POST /api/admin/send-whatsapp
router.post('/send-whatsapp', async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: 'Phone number and message are required.' });
    }

    await notificationService.sendWhatsAppMessage(to, message, 'admin_manual');
    return res.status(200).json({ success: true, message: 'WhatsApp message queued.' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ message: 'Failed to send WhatsApp message.' });
  }
});

// Backward-compatible alias
router.post('/send-email', async (req: Request, res: Response) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ message: 'Phone number and message are required.' });
  }

  await notificationService.sendWhatsAppMessage(to, message, 'admin_manual_alias');
  return res.status(200).json({ success: true, message: 'WhatsApp message queued.' });
});

export default router;
