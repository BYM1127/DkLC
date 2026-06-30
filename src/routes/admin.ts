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

    await couponRepo.save({ ...coupon, id: undefined as any });
    // For MongoDB-based repo, we need to delete differently
    // The MongoRepository doesn't have a delete method, so we work around it
    const collection = (couponRepo as any).collection;
    if (collection) {
      await collection.deleteOne({ id: parseInt(id, 10) });
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

    const collection = (blockedDateRepo as any).collection;
    if (collection) {
      await collection.deleteOne({ date });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error unblocking date:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === STATS ===

// GET /api/admin/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const contactRepo = AppDataSource.getRepository(ContactMessage);

    const [orders, bookings, contacts] = await Promise.all([
      orderRepo.find(),
      bookingRepo.find(),
      contactRepo.find(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

    return res.status(200).json({
      totalOrders: orders.length,
      totalBookings: bookings.length,
      totalContacts: contacts.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingOrders,
      pendingBookings,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === QUOTE SENDING ===

// POST /api/admin/orders/:id/send-quote
router.post('/orders/:id/send-quote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message, items, totalAmount, channel } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Build quote message text
    let quoteText = `Hi ${order.name},\n\nThank you for your order (${order.orderRef}) with Dimpho ke Lesego Catering.\n\n${message}`;

    if (items && items.length > 0) {
      quoteText += '\n\nQuote Details:';
      items.forEach((item: { description: string; amount: string }) => {
        if (item.description) {
          quoteText += `\n• ${item.description}: R${parseFloat(item.amount || '0').toFixed(2)}`;
        }
      });
    }

    if (totalAmount) {
      quoteText += `\n\nTotal: R${parseFloat(totalAmount).toFixed(2)}`;
    }

    quoteText += '\n\nKind regards,\nDimpho ke Lesego Catering Services\n+27 79 692 9591';

    // Build WhatsApp link
    const whatsappLink = notificationService.buildWhatsAppLink(order.phone, quoteText);

    // Send via email if channel is email and customer has email
    if (channel === 'email' && order.email) {
      try {
        const { MailerConfig } = await import('../services/MailerConfig');
        const htmlBody = `
          <div style="font-family: 'Lora', serif; max-width: 600px; margin: 0 auto; background: #FBF1E2; border: 1.5px solid #E9D6B4; border-radius: 6px; padding: 40px;">
            <h2 style="color: #5F0C0C; font-family: 'Playfair Display', serif; border-bottom: 2px solid #C2902F; padding-bottom: 10px;">Quote for Order ${order.orderRef}</h2>
            <p>Dear ${order.name},</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            ${items && items.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr><th style="text-align: left; padding: 12px; background: #5F0C0C; color: #FFF8EF;">Description</th><th style="text-align: right; padding: 12px; background: #5F0C0C; color: #FFF8EF;">Amount</th></tr>
                </thead>
                <tbody>
                  ${items.map((i: any) => i.description ? `<tr><td style="padding: 10px; border-bottom: 1px dotted #E9D6B4;">${i.description}</td><td style="padding: 10px; border-bottom: 1px dotted #E9D6B4; text-align: right;">R${parseFloat(i.amount || '0').toFixed(2)}</td></tr>` : '').join('')}
                </tbody>
              </table>` : ''}
            ${totalAmount ? `<div style="font-size: 1.2em; font-weight: bold; color: #5F0C0C; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #C2902F;">Total: R${parseFloat(totalAmount).toFixed(2)}</div>` : ''}
            <p style="margin-top: 20px;">Kind regards,<br><strong>Dimpho ke Lesego Catering Services</strong><br>+27 79 692 9591</p>
          </div>`;
        await MailerConfig.sendEmail(order.email, `Quote for Order ${order.orderRef}`, htmlBody, quoteText);
        console.log(`[Admin] Quote email sent to ${order.email} for order ${order.orderRef}`);
      } catch (emailErr) {
        console.error('[Admin] Failed to send quote email:', emailErr);
        // Don't fail the whole request — return the WhatsApp link as fallback
      }
    }

    // Log the notification via WhatsApp service
    await notificationService.sendWhatsAppMessage(order.phone, quoteText, `quote_order_${order.orderRef}`);

    return res.status(200).json({
      success: true,
      whatsappLink,
      message: channel === 'email' ? 'Quote sent via email.' : 'WhatsApp link generated.',
    });
  } catch (error) {
    console.error('Error sending order quote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/bookings/:id/send-quote
router.post('/bookings/:id/send-quote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message, items, totalAmount, channel } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const bookingRepo = AppDataSource.getRepository(BookingRequest);
    const booking = await bookingRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    let quoteText = `Hi ${booking.name},\n\nThank you for your booking enquiry with Dimpho ke Lesego Catering.\n\n${message}`;

    if (items && items.length > 0) {
      quoteText += '\n\nQuote Details:';
      items.forEach((item: { description: string; amount: string }) => {
        if (item.description) {
          quoteText += `\n• ${item.description}: R${parseFloat(item.amount || '0').toFixed(2)}`;
        }
      });
    }

    if (totalAmount) {
      quoteText += `\n\nTotal: R${parseFloat(totalAmount).toFixed(2)}`;
    }

    quoteText += '\n\nKind regards,\nDimpho ke Lesego Catering Services\n+27 79 692 9591';

    const whatsappLink = notificationService.buildWhatsAppLink(booking.phone, quoteText);

    if (channel === 'email' && booking.email) {
      try {
        const { MailerConfig } = await import('../services/MailerConfig');
        const htmlBody = `
          <div style="font-family: 'Lora', serif; max-width: 600px; margin: 0 auto; background: #FBF1E2; border: 1.5px solid #E9D6B4; border-radius: 6px; padding: 40px;">
            <h2 style="color: #5F0C0C; font-family: 'Playfair Display', serif; border-bottom: 2px solid #C2902F; padding-bottom: 10px;">Booking Quote</h2>
            <p>Dear ${booking.name},</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            ${items && items.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr><th style="text-align: left; padding: 12px; background: #5F0C0C; color: #FFF8EF;">Description</th><th style="text-align: right; padding: 12px; background: #5F0C0C; color: #FFF8EF;">Amount</th></tr>
                </thead>
                <tbody>
                  ${items.map((i: any) => i.description ? `<tr><td style="padding: 10px; border-bottom: 1px dotted #E9D6B4;">${i.description}</td><td style="padding: 10px; border-bottom: 1px dotted #E9D6B4; text-align: right;">R${parseFloat(i.amount || '0').toFixed(2)}</td></tr>` : '').join('')}
                </tbody>
              </table>` : ''}
            ${totalAmount ? `<div style="font-size: 1.2em; font-weight: bold; color: #5F0C0C; text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #C2902F;">Total: R${parseFloat(totalAmount).toFixed(2)}</div>` : ''}
            <p style="margin-top: 20px;">Kind regards,<br><strong>Dimpho ke Lesego Catering Services</strong><br>+27 79 692 9591</p>
          </div>`;
        await MailerConfig.sendEmail(booking.email, 'Booking Quote – Dimpho ke Lesego Catering', htmlBody, quoteText);
        console.log(`[Admin] Quote email sent to ${booking.email} for booking #${booking.id}`);
      } catch (emailErr) {
        console.error('[Admin] Failed to send booking quote email:', emailErr);
      }
    }

    await notificationService.sendWhatsAppMessage(booking.phone, quoteText, `quote_booking_${booking.id}`);

    return res.status(200).json({
      success: true,
      whatsappLink,
      message: channel === 'email' ? 'Quote sent via email.' : 'WhatsApp link generated.',
    });
  } catch (error) {
    console.error('Error sending booking quote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/contacts/:id/reply
router.post('/contacts/:id/reply', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message, channel } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contact = await contactRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    const replyText = `Hi ${contact.name},\n\nThank you for reaching out to Dimpho ke Lesego Catering.\n\n${message}\n\nKind regards,\nDimpho ke Lesego Catering Services\n+27 79 692 9591`;

    const whatsappLink = contact.phone
      ? notificationService.buildWhatsAppLink(contact.phone, replyText)
      : '';

    if (channel === 'email' && contact.email) {
      try {
        const { MailerConfig } = await import('../services/MailerConfig');
        const htmlBody = `
          <div style="font-family: 'Lora', serif; max-width: 600px; margin: 0 auto; background: #FBF1E2; border: 1.5px solid #E9D6B4; border-radius: 6px; padding: 40px;">
            <h2 style="color: #5F0C0C; font-family: 'Playfair Display', serif; border-bottom: 2px solid #C2902F; padding-bottom: 10px;">Reply from Dimpho ke Lesego Catering</h2>
            <p>Dear ${contact.name},</p>
            <p>Thank you for reaching out to us.</p>
            <div style="background: #FFF8EF; border-left: 4px solid #C2902F; padding: 15px; margin: 20px 0;">
              <p style="font-style: italic; color: #6B5A48;">Your message: "${contact.message}"</p>
            </div>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p style="margin-top: 20px;">Kind regards,<br><strong>Dimpho ke Lesego Catering Services</strong><br>+27 79 692 9591</p>
          </div>`;
        await MailerConfig.sendEmail(contact.email, 'Reply from Dimpho ke Lesego Catering', htmlBody, replyText);
        console.log(`[Admin] Reply email sent to ${contact.email} for contact #${contact.id}`);
      } catch (emailErr) {
        console.error('[Admin] Failed to send contact reply email:', emailErr);
      }
    }

    if (contact.phone) {
      await notificationService.sendWhatsAppMessage(contact.phone, replyText, `reply_contact_${contact.id}`);
    }

    return res.status(200).json({
      success: true,
      whatsappLink,
      message: channel === 'email' ? 'Reply sent via email.' : 'WhatsApp link generated.',
    });
  } catch (error) {
    console.error('Error sending contact reply:', error);
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

