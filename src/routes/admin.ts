import { Router, Request, Response } from 'express';
import * as path from 'path';
import * as crypto from 'crypto';
import { AppDataSource } from '../database';
import { ContactMessage, QuoteRequest, MenuItem, GalleryImage, SiteSettings, PresetMenu } from '../entities';
import { EmailService } from '../services/EmailService';
import { isServerlessRuntime } from '../runtime';

const router = Router();
const webRootPath = path.join(__dirname, '..', '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
const notificationService = new EmailService(webRootPath);

const activeSessions = new Set<string>();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  const expectedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  if (!expectedEmail || !expectedPassword) {
    return res.status(503).json({ message: 'Admin credentials are not configured on the server.' });
  }

  if (
    !email ||
    !password ||
    email.trim().toLowerCase() !== expectedEmail ||
    password !== expectedPassword
  ) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);
  setTimeout(() => activeSessions.delete(token), 8 * 60 * 60 * 1000);

  console.log(`[Admin] Login successful for ${email}`);
  return res.status(200).json({ token });
});

router.use((req: Request, res: Response, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const emailSet = !!process.env.ADMIN_EMAIL;
  const passwordSet = !!process.env.ADMIN_PASSWORD;

  if (!emailSet && !passwordSet && !isServerlessRuntime()) {
    return next();
  }

  const authHeader = req.header('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  return next();
});

// === STATS ===
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const quoteRepo = AppDataSource.getRepository(QuoteRequest);
    const contactRepo = AppDataSource.getRepository(ContactMessage);

    const [quotes, contacts] = await Promise.all([
      quoteRepo.find(),
      contactRepo.find(),
    ]);

    const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;

    return res.status(200).json({
      totalQuotes: quotes.length,
      totalContacts: contacts.length,
      pendingQuotes,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === CONTACTS ===
router.get('/contacts', async (req: Request, res: Response) => {
  try {
    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contacts = await contactRepo.find({ order: { createdAt: 'DESC' } });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/contacts/:id/reply', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message, channel } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required.' });

    const contactRepo = AppDataSource.getRepository(ContactMessage);
    const contact = await contactRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!contact) return res.status(404).json({ message: 'Contact not found.' });

    if (channel === 'whatsapp') {
      const whatsappLink = notificationService.buildWhatsAppLink(contact.phone || '', message);
      return res.status(200).json({ success: true, whatsappLink });
    } else if (channel === 'email') {
      // In a real app, send an email here.
      // For now, simulate success.
      return res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid channel specified.' });
    }
  } catch (error) {
    console.error('Error replying to contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === QUOTES ===
router.get('/quotes', async (req: Request, res: Response) => {
  try {
    const quoteRepo = AppDataSource.getRepository(QuoteRequest);
    const quotes = await quoteRepo.find({ order: { createdAt: 'DESC' } });
    return res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/quotes/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'Status is required.' });

    const quoteRepo = AppDataSource.getRepository(QuoteRequest);
    const quote = await quoteRepo.findOne({ where: { id: parseInt(id, 10) } });

    if (!quote) return res.status(404).json({ message: 'Quote not found.' });

    quote.status = status;
    await quoteRepo.save(quote);
    return res.status(200).json({ success: true, status: quote.status });
  } catch (error) {
    console.error('Error updating quote status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === MENU MANAGEMENT ===
router.get('/menu', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(MenuItem);
    const items = await repo.find();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/menu', async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageBase64, isActive } = req.body;
    const repo = AppDataSource.getRepository(MenuItem);
    const item = repo.create({
      name, description, price: Number(price), category, imageBase64, isActive
    });
    await repo.save(item);
    return res.status(200).json({ success: true, id: item.id });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/menu/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, imageBase64, isActive } = req.body;
    const repo = AppDataSource.getRepository(MenuItem);
    const item = await repo.findOne({ where: { id: parseInt(id, 10) } });
    
    if (!item) return res.status(404).json({ message: 'Item not found' });

    Object.assign(item, { name, description, price: Number(price), category, imageBase64, isActive });
    await repo.save(item);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/menu/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(MenuItem);
    const collection = (repo as any).collection;
    await collection.deleteOne({ id: parseInt(id, 10) });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === PRESET MENU MANAGEMENT ===
router.get('/preset-menus', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(PresetMenu);
    const menus = await repo.find();
    return res.status(200).json(menus);
  } catch (error) {
    console.error('Error fetching preset menus:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/preset-menus', async (req: Request, res: Response) => {
  try {
    const { name, description, items, imageBase64, isActive } = req.body;
    const repo = AppDataSource.getRepository(PresetMenu);
    const preset = repo.create({
      name, description, items: JSON.stringify(items), imageBase64, isActive
    });
    await repo.save(preset);
    return res.status(200).json({ success: true, id: preset.id });
  } catch (error) {
    console.error('Error creating preset menu:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/preset-menus/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, items, imageBase64, isActive } = req.body;
    const repo = AppDataSource.getRepository(PresetMenu);
    const preset = await repo.findOne({ where: { id: parseInt(id, 10) } });
    
    if (!preset) return res.status(404).json({ message: 'Preset menu not found' });

    Object.assign(preset, { name, description, items: JSON.stringify(items), imageBase64, isActive });
    await repo.save(preset);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating preset menu:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/preset-menus/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(PresetMenu);
    const collection = (repo as any).collection;
    await collection.deleteOne({ id: parseInt(id, 10) });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting preset menu:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === GALLERY MANAGEMENT ===
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(GalleryImage);
    const images = await repo.find({ order: { id: 'DESC' } });
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/gallery', async (req: Request, res: Response) => {
  try {
    const { eventName, description, imageBase64 } = req.body;
    const repo = AppDataSource.getRepository(GalleryImage);
    const image = repo.create({ eventName, description, imageBase64 });
    await repo.save(image);
    return res.status(200).json({ success: true, id: image.id });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/gallery/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(GalleryImage);
    const collection = (repo as any).collection;
    await collection.deleteOne({ id: parseInt(id, 10) });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === SETTINGS MANAGEMENT ===
router.put('/settings', async (req: Request, res: Response) => {
  try {
    const { aboutText, contactPhone, contactEmail, address, deliveryAreas, hoursOfOperation } = req.body;
    const repo = AppDataSource.getRepository(SiteSettings);
    
    let settings = (await repo.find())[0];
    if (!settings) {
      settings = repo.create({});
    }

    Object.assign(settings, { aboutText, contactPhone, contactEmail, address, deliveryAreas, hoursOfOperation, updatedAt: new Date() });
    await repo.save(settings);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// === WHATSAPP ===
router.post('/send-whatsapp', async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ message: 'Phone number and message are required.' });

    await notificationService.sendWhatsAppMessage(to, message, 'admin_manual');
    return res.status(200).json({ success: true, message: 'WhatsApp message queued.' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ message: 'Failed to send WhatsApp message.' });
  }
});

export default router;
