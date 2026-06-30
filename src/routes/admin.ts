import { Router, Request, Response } from 'express';
import * as path from 'path';
import { AppDataSource } from '../database';
import { ContactMessage, BookingRequest, Order } from '../entities';
import { EmailService } from '../services/EmailService';

const router = Router();
const webRootPath = path.join(__dirname, '..', '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
const notificationService = new EmailService(webRootPath);

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
