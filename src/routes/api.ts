import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { ContactMessage, QuoteRequest, MenuItem, GalleryImage, SiteSettings } from '../entities';

const router = Router();

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

// GET /api/menu
router.get('/menu', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(MenuItem);
    const items = await repo.find({ where: { isActive: true } });
    return res.status(200).json(items);
  } catch (error) {
    console.error('[API] Error fetching menu:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/gallery
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(GalleryImage);
    const images = await repo.find({ order: { id: 'DESC' } });
    return res.status(200).json(images);
  } catch (error) {
    console.error('[API] Error fetching gallery:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SiteSettings);
    const settings = await repo.find();
    if (settings.length > 0) {
      return res.status(200).json(settings[0]);
    }
    return res.status(404).json({ message: 'Settings not found' });
  } catch (error) {
    console.error('[API] Error fetching settings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

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

    return res.status(200).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('[API] Error creating contact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quotes
router.post('/quotes', async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      dateNeeded,
      guestCount,
      notes,
      venueLocation,
      providerType,
      selectedMenu
    } = req.body;

    console.log(`[API] Quote submission from: ${name}, phone: ${phone}, event: ${eventType}`);

    if (!name || !phone) {
      console.warn('[API] Quote rejected: missing name or phone');
      return res.status(400).json({ message: 'Name and Phone are required.' });
    }

    const quoteRepo = AppDataSource.getRepository(QuoteRequest);
    const quote = quoteRepo.create({
      name,
      phone,
      email: email || '',
      eventType: eventType || '',
      dateNeeded: dateNeeded || '',
      guestCount: guestCount ? Number(guestCount) : 0,
      notes: notes || '',
      venueLocation: venueLocation || '',
      providerType: providerType || '',
      selectedMenu: selectedMenu || '',
      status: 'Pending',
    });

    await quoteRepo.save(quote);
    console.log(`[API] Quote saved successfully, id: ${quote.id}`);

    return res.status(200).json({ success: true, id: quote.id });
  } catch (error) {
    console.error('[API] Error creating quote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
