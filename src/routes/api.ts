import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { ContactMessage, BookingRequest, Coupon, BlockedDate, Order, OrderItem } from '../entities';
import { EmailService } from '../services/EmailService';
import * as path from 'path';

const router = Router();
const webRootPath = path.join(__dirname, '..', '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
const emailService = new EmailService(webRootPath);

const generateUniqueOrderRef = async (orderRepo: ReturnType<typeof AppDataSource.getRepository>): Promise<string> => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const orderRef = 'DKL-' + Math.floor(Math.random() * 900000 + 100000);
    const existingOrder = await orderRepo.findOne({ where: { orderRef } });

    if (!existingOrder) {
      return orderRef;
    }
  }

  return `DKL-${Date.now()}`;
};

// POST /api/contacts
router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and Message are required.' });
    }

    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contact = contactRepo.create({ name, email, phone, message });
    await contactRepo.save(contact);

    // Send confirmation WhatsApp notifications (async, don't block response)
    emailService.sendContactFormEmail(contact).catch(err => {
      console.error('Failed to send contact WhatsApp notification:', err);
    });

    return res.status(200).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/bookings
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      eventDate,
      estimatedGuests,
      preferredPackage,
      fulfilmentType,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone are required.' });
    }

    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const isBlocked = await blockedDateRepo.findOne({ where: { date: eventDate } });

    if (isBlocked) {
      return res.status(400).json({ message: 'Sorry, we are fully booked on this date. Please select another date.' });
    }

    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const booking = bookingRepo.create({
      name,
      phone,
      email,
      eventType,
      eventDate,
      estimatedGuests,
      preferredPackage,
      fulfilmentType,
      notes,
      status: 'Pending',
    });

    await bookingRepo.save(booking);

    // Send confirmation WhatsApp notifications (async, don't block response)
    emailService.sendBookingConfirmationEmail(booking).catch(err => {
      console.error('Failed to send booking WhatsApp notification:', err);
    });

    return res.status(200).json({ success: true, id: booking.id });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/availability/blocked-dates
router.get('/availability/blocked-dates', async (req: Request, res: Response) => {
  try {
    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const dates = await blockedDateRepo.find();
    const dateStrings = dates.map(d => d.date);
    return res.status(200).json(dateStrings);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/coupons/validate
router.get('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, amount } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const couponRepo = AppDataSource.getRepository(Coupon);
    const coupon = await couponRepo.findOne({
      where: {
        code: (code as string).toUpperCase(),
        isActive: true,
      },
    });

    if (!coupon) {
      return res.status(200).json({ valid: false, message: 'Invalid or expired coupon code.' });
    }

    const amountNum = parseFloat(amount as string);
    let discount = 0;

    if (coupon.discountType === 'Percentage') {
      discount = amountNum * (coupon.value / 100);
    } else if (coupon.discountType === 'Fixed') {
      discount = coupon.value;
    }

    discount = Math.min(discount, amountNum);
    const newTotal = amountNum - discount;

    return res.status(200).json({
      valid: true,
      discount: Math.round(discount * 100) / 100,
      newTotal: Math.round(newTotal * 100) / 100,
      code: coupon.code,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/orders
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, fulfilmentType, deliveryAddress, dateNeeded, timeNeeded, notes, couponApplied, items } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone number are required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order cart is empty.' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const couponRepo = AppDataSource.getRepository(Coupon);

    // Calculate totals
    const originalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    let discountAmount = 0;
    let appliedCouponCode = '';

    if (couponApplied) {
      const coupon = await couponRepo.findOne({
        where: {
          code: couponApplied.toUpperCase(),
          isActive: true,
        },
      });

      if (coupon) {
        appliedCouponCode = coupon.code;
        if (coupon.discountType === 'Percentage') {
          discountAmount = originalAmount * (coupon.value / 100);
        } else if (coupon.discountType === 'Fixed') {
          discountAmount = coupon.value;
        }
        discountAmount = Math.min(discountAmount, originalAmount);
      }
    }

    const totalAmount = originalAmount - discountAmount;
    const orderRef = await generateUniqueOrderRef(orderRepo);

    const order = new Order();
    order.orderRef = orderRef;
    order.name = name.trim();
    order.phone = phone.trim();
    order.email = email?.trim() || '';
    order.fulfilmentType = fulfilmentType || 'Delivery';
    order.deliveryAddress = deliveryAddress?.trim() || '';
    order.dateNeeded = dateNeeded || '';
    order.timeNeeded = timeNeeded || '';
    order.notes = notes?.trim() || '';
    order.originalAmount = Math.round(originalAmount * 100) / 100;
    order.discountAmount = Math.round(discountAmount * 100) / 100;
    order.totalAmount = Math.round(totalAmount * 100) / 100;
    order.couponApplied = appliedCouponCode;
    order.status = 'Pending';
    order.orderItems = items.map((item: any) => {
      const oi = new OrderItem();
      oi.itemId = item.itemId;
      oi.name = item.name;
      oi.price = Math.round(item.price * 100) / 100;
      oi.quantity = item.quantity;
      oi.isPackage = item.isPackage;
      return oi;
    });

    await orderRepo.save(order);

    // Send order confirmation WhatsApp notifications (async, don't block response)
    emailService.sendOrderConfirmationEmail(order).catch(err => {
      console.error('Failed to send order WhatsApp notification:', err);
    });

    return res.status(200).json({
      success: true,
      orderRef: order.orderRef,
      total: order.totalAmount,
      discount: order.discountAmount,
      customerWhatsappLink: emailService.buildCustomerOrderLink(order),
      businessWhatsappLink: emailService.buildAdminOrderLink(order),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bookings/lookup/:id
router.get('/bookings/lookup/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    
    const booking = await bookingRepo.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/orders/lookup/:ref
router.get('/orders/lookup/:ref', async (req: Request, res: Response) => {
  try {
    const { ref } = req.params;
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
      where: { orderRef: ref.toUpperCase() },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      id: order.id,
      orderRef: order.orderRef,
      name: order.name,
      phone: order.phone,
      email: order.email,
      fulfilmentType: order.fulfilmentType,
      deliveryAddress: order.deliveryAddress,
      dateNeeded: order.dateNeeded,
      timeNeeded: order.timeNeeded,
      notes: order.notes,
      originalAmount: order.originalAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      couponApplied: order.couponApplied,
      status: order.status,
      createdAt: order.createdAt,
      items: order.orderItems.map(i => ({
        itemId: i.itemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        isPackage: i.isPackage,
      })),
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
