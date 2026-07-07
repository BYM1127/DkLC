import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { ContactMessage, BookingRequest, Coupon, BlockedDate, Order, OrderItem } from '../entities';
import { EmailService } from '../services/EmailService';
import * as path from 'path';
import { randomBytes } from 'crypto';

const router = Router();
const webRootPath = path.join(__dirname, '..', '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
const emailService = new EmailService(webRootPath);

// === REQUEST LOGGING MIDDLEWARE ===
router.use((req: Request, _res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[API ${timestamp}] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[API] Request body:`, JSON.stringify(req.body, null, 2));
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`[API] Query params:`, req.query);
  }
  next();
});

const generateUniqueOrderRef = async (orderRepo: { findOne: (options: any) => Promise<Order | null> }): Promise<string> => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const orderRef = 'DKL-' + Math.floor(Math.random() * 900000 + 100000);
    const existingOrder = await orderRepo.findOne({ where: { orderRef } });

    if (!existingOrder) {
      return orderRef;
    }
  }

  return `DKL-${Date.now()}`;
};

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully submitted the contact message
 *       400:
 *         description: Missing required fields
 */
// POST /api/contacts
router.post('/contacts', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log(`[API] Contact submission from: ${name}, phone: ${phone || 'N/A'}, email: ${email || 'N/A'}`);

    if (!name || !message) {
      console.warn('[API] Contact rejected: missing name or message');
      return res.status(400).json({ message: 'Name and Message are required.' });
    }

    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contact = contactRepo.create({ name, email, phone, message });
    await contactRepo.save(contact);
    console.log(`[API] Contact saved successfully, id: ${contact.id}`);

    // Send confirmation WhatsApp notifications (async, don't block response)
    emailService.sendContactFormEmail(contact).catch(err => {
      console.error('[API] Failed to send contact WhatsApp notification:', err);
    });

    return res.status(200).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('[API] Error creating contact:', error);
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
      ingredientSourcing,
      estimatedHours,
      staffHourlyRate
    } = req.body;
    console.log(`[API] Booking submission from: ${name}, phone: ${phone}, event: ${eventType}, date: ${eventDate}`);

    if (!name || !phone) {
      console.warn('[API] Booking rejected: missing name or phone');
      return res.status(400).json({ message: 'Name and Phone are required.' });
    }

    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const isBlocked = eventDate
      ? await blockedDateRepo.findOne({ where: { date: eventDate } })
      : null;

    if (isBlocked) {
      console.warn(`[API] Booking rejected: date ${eventDate} is blocked`);
      return res.status(400).json({ message: 'Sorry, we are fully booked on this date. Please select another date.' });
    }

    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const booking = bookingRepo.create({
      accessToken: randomBytes(24).toString('hex'),
      name,
      phone,
      email: email || '',
      eventType: eventType || '',
      eventDate: eventDate || '',
      estimatedGuests: estimatedGuests || null,
      preferredPackage: preferredPackage || '',
      fulfilmentType: fulfilmentType || '',
      notes: notes || '',
      ingredientSourcing: ingredientSourcing || '',
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      staffHourlyRate: staffHourlyRate || '',
      status: 'Pending',
    });

    await bookingRepo.save(booking);
    console.log(`[API] Booking saved successfully, id: ${booking.id}`);

    // Send confirmation WhatsApp notifications (async, don't block response)
    emailService.sendBookingConfirmationEmail(booking).catch(err => {
      console.error('[API] Failed to send booking WhatsApp notification:', err);
    });

    return res.status(200).json({ success: true, id: booking.id, accessToken: booking.accessToken });
  } catch (error) {
    console.error('[API] Error creating booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/availability/blocked-dates
router.get('/availability/blocked-dates', async (req: Request, res: Response) => {
  try {
    const blockedDateRepo = AppDataSource.getRepository(BlockedDate);
    const dates = await blockedDateRepo.find();
    const dateStrings = dates.map(d => d.date);
    console.log(`[API] Returning ${dateStrings.length} blocked dates`);
    return res.status(200).json(dateStrings);
  } catch (error) {
    console.error('[API] Error fetching blocked dates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/coupons/validate
router.get('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, amount } = req.query;
    console.log(`[API] Coupon validation: code=${code}, amount=${amount}`);

    if (!code) {
      console.warn('[API] Coupon validation rejected: no code provided');
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
      console.log(`[API] Coupon "${code}" not found or inactive`);
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

    console.log(`[API] Coupon "${coupon.code}" valid: discount=R${discount}, newTotal=R${newTotal}`);
    return res.status(200).json({
      valid: true,
      discount: Math.round(discount * 100) / 100,
      newTotal: Math.round(newTotal * 100) / 100,
      code: coupon.code,
    });
  } catch (error) {
    console.error('[API] Error validating coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/orders
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, fulfilmentType, deliveryAddress, dateNeeded, timeNeeded, notes, couponApplied, items, distanceKm, paymentMethod } = req.body;
    console.log(`[API] Order submission from: ${name}, phone: ${phone}, items: ${items?.length || 0}`);
    if (items && items.length > 0) {
      console.log(`[API] Order items:`, items.map((i: any) => `${i.name} x${i.quantity} @R${i.price}`).join(', '));
    }

    if (!name || !phone) {
      console.warn('[API] Order rejected: missing name or phone');
      return res.status(400).json({ message: 'Name and Phone number are required.' });
    }

    if (!items || items.length === 0) {
      console.warn('[API] Order rejected: empty cart');
      return res.status(400).json({ message: 'Order cart is empty.' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const couponRepo = AppDataSource.getRepository(Coupon);

    // Calculate totals
    const originalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    let discountAmount = 0;
    let appliedCouponCode = '';

    if (couponApplied) {
      console.log(`[API] Applying coupon: ${couponApplied}`);
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
        console.log(`[API] Coupon applied: ${coupon.code}, discount: R${discountAmount}`);
      } else {
        console.log(`[API] Coupon "${couponApplied}" not found or inactive, ignoring`);
      }
    }

    // Delivery Fee Calculation
    let deliveryFee = 0;
    if (fulfilmentType === 'Delivery') {
      const dist = distanceKm ? parseFloat(distanceKm) : 0;
      deliveryFee = 100 + (Math.ceil(dist / 200) * 50);
    }

    const totalAmount = originalAmount - discountAmount + deliveryFee;
    const orderRef = await generateUniqueOrderRef(orderRepo);
    console.log(`[API] Order totals: original=R${originalAmount}, discount=R${discountAmount}, delivery=R${deliveryFee}, total=R${totalAmount}, ref=${orderRef}`);

    const order = new Order();
    order.orderRef = orderRef;
    order.accessToken = randomBytes(24).toString('hex');
    order.name = name.trim();
    order.phone = phone.trim();
    order.email = email?.trim() || '';
    order.fulfilmentType = fulfilmentType || 'Delivery';
    order.deliveryAddress = deliveryAddress?.trim() || '';
    order.dateNeeded = dateNeeded || '';
    order.timeNeeded = timeNeeded || '';
    order.notes = notes?.trim() || '';
    order.distanceKm = distanceKm ? parseFloat(distanceKm) : 0;
    order.deliveryFee = deliveryFee;
    order.paymentMethod = paymentMethod || 'EFT';
    order.paymentStatus = 'Pending';
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
    console.log(`[API] ✅ Order saved successfully: ref=${order.orderRef}, id=${order.id}`);

    // Send order confirmation WhatsApp notifications (async, don't block response)
    emailService.sendOrderConfirmationEmail(order).catch(err => {
      console.error('[API] Failed to send order WhatsApp notification:', err);
    });

    let paymentLink = '';
    if (paymentMethod === 'Online') {
      paymentLink = `https://paystack.com/pay/demo_catering_link?ref=${order.orderRef}&amount=${Math.round(order.totalAmount * 100)}`;
    }

    return res.status(200).json({
      success: true,
      orderRef: order.orderRef,
      accessToken: order.accessToken,
      total: order.totalAmount,
      discount: order.discountAmount,
      customerWhatsappLink: emailService.buildCustomerOrderLink(order),
      businessWhatsappLink: emailService.buildAdminOrderLink(order),
      paymentLink
    });
  } catch (error) {
    console.error('[API] ❌ Error creating order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/bookings/lookup/:id
router.get('/bookings/lookup/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const accessToken = typeof req.query.token === 'string' ? req.query.token : '';
    console.log(`[API] Booking lookup: id=${id}`);
    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    
    const booking = await bookingRepo.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!booking || !booking.accessToken || booking.accessToken !== accessToken) {
      console.log(`[API] Booking lookup: not found or token mismatch for id=${id}`);
      return res.status(404).json({ message: 'Booking request not found' });
    }

    console.log(`[API] Booking lookup: found booking for ${booking.name}`);
    return res.status(200).json(booking);
  } catch (error) {
    console.error('[API] Error fetching booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/orders/lookup/:ref
router.get('/orders/lookup/:ref', async (req: Request, res: Response) => {
  try {
    const { ref } = req.params;
    console.log(`[API] Order lookup: ref=${ref}`);
    const orderRepo = AppDataSource.getRepository(Order);
    const accessToken = typeof req.query.token === 'string' ? req.query.token : '';
    const order = await orderRepo.findOne({
      where: { orderRef: ref.toUpperCase() },
    });

    if (!order || !order.accessToken || order.accessToken !== accessToken) {
      console.log(`[API] Order lookup: not found or token mismatch for ref=${ref}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`[API] Order lookup: found order ${order.orderRef} for ${order.name}, total=R${order.totalAmount}`);
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
    console.error('[API] Error fetching order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
