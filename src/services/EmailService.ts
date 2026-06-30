import * as fs from 'fs';
import * as path from 'path';
import { Order } from '../entities/Order';
import { BookingRequest } from '../entities/BookingRequest';
import { ContactMessage } from '../entities/ContactMessage';

export class EmailService {
  private logsPath: string;

  constructor(webRootPath: string) {
    this.logsPath = process.env.NETLIFY ? path.join('/tmp', 'whatsapp') : path.join(webRootPath, 'logs', 'whatsapp');
    this.ensureLogsDirectoryExists();
  }

  private ensureLogsDirectoryExists(): void {
    if (!fs.existsSync(this.logsPath)) {
      fs.mkdirSync(this.logsPath, { recursive: true });
    }
  }

  private normalizePhone(phone: string): string {
    const digits = (phone || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('27') && digits.length > 10) return `+${digits}`;
    if (digits.startsWith('0')) return `+27${digits.slice(1)}`;
    return `+${digits}`;
  }

  public buildWhatsAppLink(phone: string, message: string): string {
    const normalized = this.normalizePhone(phone);
    return normalized ? `https://wa.me/${normalized.replace('+', '')}?text=${encodeURIComponent(message)}` : '';
  }

  public async sendWhatsAppMessage(toPhone: string, message: string, label: string): Promise<void> {
    const normalizedPhone = this.normalizePhone(toPhone);
    if (!normalizedPhone) {
      console.warn(`No valid phone number available for WhatsApp notification (${label}).`);
      return;
    }

    const waLink = this.buildWhatsAppLink(normalizedPhone, message);
    console.log(`WhatsApp click-to-chat link prepared for ${normalizedPhone}: ${waLink}`);

    this.logWhatsAppToFile(label, normalizedPhone, message, waLink);
  }

  private logWhatsAppToFile(type: string, recipient: string, message: string, link: string): void {
    try {
      const timestamp = new Date().getTime();
      const sanitized = recipient.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${type}_${sanitized}_${timestamp}.json`;
      const filepath = path.join(this.logsPath, filename);
      fs.writeFileSync(filepath, JSON.stringify({ type, recipient, message, link, createdAt: new Date().toISOString() }, null, 2), 'utf-8');
      console.log(`WhatsApp notification logged to: ${filepath}`);
    } catch (error) {
      console.error('Error logging WhatsApp notification:', error);
    }
  }

  private buildContactMessage(contact: ContactMessage): string {
    return [
      `Hello ${contact.name}, thank you for reaching out to Dimpho ke Lesego Catering.`,
      '',
      `Your message: ${contact.message}`,
      '',
      'We will respond on WhatsApp as soon as possible.',
    ].join('\n');
  }

  private buildAdminContactMessage(contact: ContactMessage): string {
    return [
      'New contact request from your website',
      `Name: ${contact.name}`,
      `Phone: ${contact.phone || 'Not provided'}`,
      `Email: ${contact.email || 'Not provided'}`,
      `Message: ${contact.message}`,
    ].join('\n');
  }

  private buildBookingMessage(booking: BookingRequest): string {
    return [
      `Hello ${booking.name}, thank you for your booking enquiry with Dimpho ke Lesego Catering.`,
      `Event type: ${booking.eventType}`,
      `Date: ${booking.eventDate}`,
      `Guests: ${booking.estimatedGuests || 'TBC'}`,
      'We will contact you on WhatsApp shortly to confirm the details.',
    ].join('\n');
  }

  private buildAdminBookingMessage(booking: BookingRequest): string {
    return [
      'New booking enquiry from your website',
      `Name: ${booking.name}`,
      `Phone: ${booking.phone}`,
      `Email: ${booking.email || 'Not provided'}`,
      `Event type: ${booking.eventType}`,
      `Date: ${booking.eventDate}`,
      `Guests: ${booking.estimatedGuests || 'TBC'}`,
    ].join('\n');
  }

  private buildOrderMessage(order: Order): string {
    return [
      `Hello ${order.name}, thank you for your order with Dimpho ke Lesego Catering.`,
      `Order reference: ${order.orderRef}`,
      `Total: R${order.totalAmount}`,
      'We will contact you on WhatsApp to confirm delivery or collection details.',
    ].join('\n');
  }

  private buildAdminOrderMessage(order: Order): string {
    return [
      'New order received from your website',
      `Order reference: ${order.orderRef}`,
      `Name: ${order.name}`,
      `Phone: ${order.phone}`,
      `Email: ${order.email || 'Not provided'}`,
      `Total: R${order.totalAmount}`,
    ].join('\n');
  }

  public buildCustomerOrderMessage(order: Order): string {
    return this.buildOrderMessage(order);
  }

  public buildAdminOrderLink(order: Order): string {
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '27796929591';
    return this.buildWhatsAppLink(adminPhone, this.buildAdminOrderMessage(order));
  }

  public buildCustomerOrderLink(order: Order): string {
    return this.buildWhatsAppLink(order.phone, this.buildOrderMessage(order));
  }

  /**
   * Send contact form response message to customer and admin notification to business
   */
  async sendContactFormEmail(contact: ContactMessage): Promise<void> {
    try {
      const customerMessage = this.buildContactMessage(contact);
      const adminMessage = this.buildAdminContactMessage(contact);

      await this.sendWhatsAppMessage(contact.phone || contact.email || '', customerMessage, 'contact_customer');

      const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '27796929591';
      await this.sendWhatsAppMessage(adminPhone, adminMessage, 'contact_admin');
    } catch (error) {
      console.error('Error sending contact WhatsApp notification:', error);
    }
  }

  /**
   * Send booking confirmation message to customer and admin notification to business
   */
  async sendBookingConfirmationEmail(booking: BookingRequest): Promise<void> {
    try {
      const customerMessage = this.buildBookingMessage(booking);
      const adminMessage = this.buildAdminBookingMessage(booking);

      await this.sendWhatsAppMessage(booking.phone, customerMessage, 'booking_customer');

      const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '27796929591';
      await this.sendWhatsAppMessage(adminPhone, adminMessage, 'booking_admin');
    } catch (error) {
      console.error('Error sending booking WhatsApp notification:', error);
    }
  }

  /**
   * Send order confirmation message to customer and admin notification to business
   */
  async sendOrderConfirmationEmail(order: Order): Promise<void> {
    try {
      const customerMessage = this.buildOrderMessage(order);
      const adminMessage = this.buildAdminOrderMessage(order);

      await this.sendWhatsAppMessage(order.phone, customerMessage, 'order_customer');

      const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '27796929591';
      await this.sendWhatsAppMessage(adminPhone, adminMessage, 'order_admin');
    } catch (error) {
      console.error('Error sending order WhatsApp notification:', error);
    }
  }
}

