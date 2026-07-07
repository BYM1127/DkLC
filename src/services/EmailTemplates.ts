import { ContactMessage } from '../entities/ContactMessage';
import { BookingRequest } from '../entities/BookingRequest';
import { Order } from '../entities/Order';

export class EmailTemplates {
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  private static getHeader(): string {
    return `
    <style>
      body {
        font-family: 'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #FFF8EF;
        color: #2A1B12;
        padding: 20px;
        line-height: 1.6;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #FBF1E2;
        border: 1.5px solid #E9D6B4;
        border-radius: 6px;
        padding: 40px;
        box-shadow: 0 4px 20px rgba(42,27,18,0.06);
      }
      h1, h2, h3 {
        color: #5F0C0C;
        font-family: 'Playfair Display', serif;
      }
      h2 {
        border-bottom: 2px solid #C2902F;
        padding-bottom: 10px;
        margin-top: 0;
      }
      .details {
        margin: 20px 0;
        padding: 15px;
        background: #FFF8EF;
        border-left: 4px solid #C2902F;
      }
      .details p {
        margin: 8px 0;
      }
      .item-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .item-table th,
      .item-table td {
        padding: 12px;
        border-bottom: 1px dotted #E9D6B4;
        text-align: left;
      }
      .item-table th {
        background-color: #5F0C0C;
        color: #FFF8EF;
        font-weight: bold;
      }
      .total-row {
        font-size: 1.2em;
        font-weight: bold;
        color: #5F0C0C;
        text-align: right;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid #C2902F;
      }
      .footer {
        text-align: center;
        font-size: 0.85em;
        color: #6B5A48;
        margin-top: 30px;
        border-top: 1px solid #E9D6B4;
        padding-top: 15px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #C2902F;
        color: #FFF8EF;
        text-decoration: none;
        border-radius: 4px;
        margin: 15px 0;
        font-weight: 600;
      }
      .highlight {
        color: #C2902F;
        font-weight: 600;
      }
      .contact-info {
        background: #FBF1E2;
        padding: 15px;
        border-radius: 4px;
        margin: 15px 0;
      }
    </style>`;
  }

  private static getFooter(): string {
    return `
    <div class="footer">
      <p>&copy; 2026 Dimpho ke Lesego Catering Services.<br>
      Phaphadi, Mamaila Village, 0832<br>
      <strong>Phone:</strong> +27 79 692 9591<br>
      <strong>Email:</strong> dimphokelesego@gmail.com</p>
    </div>`;
  }

  static contactFormResponse(contact: ContactMessage): { subject: string; html: string } {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank You - Contact Message Received</title>
      ${this.getHeader()}
    </head>
    <body>
      <div class="container">
        <h2>Thank You for Reaching Out</h2>
        <p>Dear ${this.escapeHtml(contact.name)},</p>
        <p>We have received your message and appreciate you taking the time to get in touch with us. Our team will review your inquiry and respond to you as soon as possible.</p>

        <div class="details">
          <h3>Your Message Details</h3>
          <p><strong>Name:</strong> ${this.escapeHtml(contact.name)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(contact.email)}</p>
          <p><strong>Message:</strong></p>
          <p style="font-style: italic;">${this.escapeHtml(contact.message).replace(/\n/g, '<br>')}</p>
        </div>

        <p>In the meantime, if you need immediate assistance, please don't hesitate to call or WhatsApp us directly at <span class="highlight">+27 79 692 9591</span>.</p>

        <p>We look forward to connecting with you!</p>

        <p>Warm regards,<br>
        <strong>Dimpho ke Lesego Catering Services</strong></p>

        ${this.getFooter()}
      </div>
    </body>
    </html>`;

    return {
      subject: 'Thank You – Your Message Has Been Received',
      html,
    };
  }

  static bookingConfirmation(booking: BookingRequest): { subject: string; html: string } {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Request Confirmation</title>
      ${this.getHeader()}
    </head>
    <body>
      <div class="container">
        <h2>Booking Request Confirmed</h2>
        <p>Dear ${this.escapeHtml(booking.name)},</p>
        <p>Thank you for submitting your event booking enquiry to Dimpho ke Lesego Catering Services. We are delighted to hear from you and look forward to helping make your event special.</p>

        <div class="details">
          <h3>Your Event Details</h3>
          <p><strong>Event Type:</strong> ${this.escapeHtml(booking.eventType)}</p>
          <p><strong>Event Date:</strong> ${booking.eventDate}</p>
          <p><strong>Estimated Guests:</strong> ${booking.estimatedGuests}</p>
          <p><strong>Preferred Package:</strong> ${this.escapeHtml(booking.preferredPackage)}</p>
          <p><strong>Fulfilment:</strong> ${booking.fulfilmentType}</p>
          ${booking.notes ? `<p><strong>Special Requests:</strong> ${this.escapeHtml(booking.notes)}</p>` : ''}
        </div>

        <h3>What Happens Next?</h3>
        <p>Our team will review your event details and contact you within <strong>24 hours</strong> at:</p>
        <div class="contact-info">
          <p><strong>Phone/WhatsApp:</strong> ${this.escapeHtml(booking.phone)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(booking.email)}</p>
        </div>

        <p>During this call, we will:</p>
        <ul>
          <li>Confirm your preferred date and confirm availability</li>
          <li>Discuss your menu preferences and dietary requirements</li>
          <li>Provide a detailed quote tailored to your event</li>
          <li>Arrange payment terms and secure your booking</li>
        </ul>

        <p>If you have any urgent questions in the meantime, please don't hesitate to call or WhatsApp us at <span class="highlight">+27 79 692 9591</span>.</p>

        <p>We cannot wait to cater your event!</p>

        <p>Warm regards,<br>
        <strong>Dimpho ke Lesego Catering Services</strong></p>

        ${this.getFooter()}
      </div>
    </body>
    </html>`;

    return {
      subject: "Booking Request Confirmed - We'll Be In Touch Soon",
      html,
    };
  }

  static orderConfirmation(order: Order): { subject: string; html: string } {
    const itemRows = order.orderItems
      .map(item => {
        const unitText = item.isPackage ? '/guest' : ' each';
        const subtotal = (item.price * item.quantity).toFixed(2);
        return `
        <tr>
          <td>${this.escapeHtml(item.name)}</td>
          <td>R${item.price.toFixed(2)}${unitText}</td>
          <td>${item.quantity}</td>
          <td>R${subtotal}</td>
        </tr>`;
      })
      .join('');

    const discountSection = order.originalAmount !== order.totalAmount
      ? `
        <tr style="background-color: #FFF8EF;">
          <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
          <td><strong>R${order.originalAmount.toFixed(2)}</strong></td>
        </tr>
        <tr style="background-color: #FFF8EF;">
          <td colspan="3" style="text-align: right;"><strong>Discount (${order.couponApplied}):</strong></td>
          <td><strong>-R${order.discountAmount.toFixed(2)}</strong></td>
        </tr>`
      : '';

    const deliveryFeeSection = order.deliveryFee > 0
      ? `
        <tr style="background-color: #FFF8EF;">
          <td colspan="3" style="text-align: right;"><strong>Delivery Fee:</strong></td>
          <td><strong>R${order.deliveryFee.toFixed(2)}</strong></td>
        </tr>`
      : '';

    const eftInstructions = order.paymentMethod === 'EFT' 
      ? `
        <div style="background-color: #FFF8EF; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #C2902F;">
          <h3 style="margin-top: 0;">Payment Instructions (EFT)</h3>
          <p>Please make your payment to the following bank account to secure your order:</p>
          <p>
            <strong>Bank:</strong> FNB<br>
            <strong>Account Name:</strong> Dimpho Ke Lesego Catering<br>
            <strong>Account Number:</strong> 62123456789<br>
            <strong>Branch Code:</strong> 250655<br>
            <strong>Reference:</strong> ${order.orderRef}
          </p>
          <p>Please reply to this email or send your Proof of Payment to our WhatsApp line.</p>
        </div>`
      : '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation ${order.orderRef}</title>
      ${this.getHeader()}
    </head>
    <body>
      <div class="container">
        <h2>Order Confirmation – ${order.orderRef}</h2>
        <p>Dear ${this.escapeHtml(order.name)},</p>
        <p>Thank you for placing your order with Dimpho ke Lesego Catering Services! We have received your online order and are preparing it with the utmost care.</p>

        <div class="details">
          <h3>Order Information</h3>
          <p><strong>Order Reference:</strong> <span class="highlight">${order.orderRef}</span></p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-ZA')} at ${new Date(order.createdAt).toLocaleTimeString('en-ZA')}</p>
          <p><strong>Fulfilment Type:</strong> ${order.fulfilmentType}</p>
          ${order.fulfilmentType === 'Delivery' ? `<p><strong>Delivery Address:</strong> ${this.escapeHtml(order.deliveryAddress)}</p>` : ''}
          <p><strong>Required Date:</strong> ${order.dateNeeded}</p>
          <p><strong>Required Time:</strong> ${order.timeNeeded}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          ${order.notes ? `<p><strong>Special Instructions:</strong> ${this.escapeHtml(order.notes)}</p>` : ''}
        </div>

        <h3>Your Order Items</h3>
        <table class="item-table">
          <thead>
            <tr>
              <th>Item / Package</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
            ${discountSection}
            ${deliveryFeeSection}
          </tbody>
        </table>

        <div class="total-row">
          Total Amount Due: R${order.totalAmount.toFixed(2)}
        </div>

        ${eftInstructions}

        <p>We will contact you within <strong>24 hours</strong> at <strong>${this.escapeHtml(order.phone)}</strong> or email you at <strong>${this.escapeHtml(order.email)}</strong> to confirm event details and final arrangements.</p>

        <h3>Next Steps</h3>
        <ul>
          <li>Confirmation call within 24 hours to confirm details</li>
          <li>Final payment arrangement and order confirmation</li>
          <li>Preparation of your order with premium ingredients</li>
          <li>Timely delivery or collection as scheduled</li>
        </ul>

        <p>If you need to make any changes to your order before we contact you, please reach out immediately at <span class="highlight">+27 79 692 9591</span>.</p>

        <p>Thank you for choosing us!</p>

        <p>Warm regards,<br>
        <strong>Dimpho ke Lesego Catering Services</strong></p>

        ${this.getFooter()}
      </div>
    </body>
    </html>`;

    return {
      subject: `Order Confirmation – ${order.orderRef}`,
      html,
    };
  }

  static adminNotification(type: 'contact' | 'booking' | 'order', data: any): { subject: string; html: string } {
    let content = '';
    let subject = '';

    if (type === 'contact') {
      subject = `New Contact Message from ${data.name}`;
      content = `
        <h3>New Contact Message Received</h3>
        <p><strong>Name:</strong> ${this.escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${this.escapeHtml(data.email)}</p>
        <p><strong>Message:</strong></p>
        <p style="font-style: italic; background: #FFF8EF; padding: 10px; border-left: 3px solid #C2902F;">${this.escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`;
    } else if (type === 'booking') {
      subject = `New Booking Enquiry from ${data.name}`;
      content = `
        <h3>New Booking Enquiry Received</h3>
        <p><strong>Name:</strong> ${this.escapeHtml(data.name)}</p>
        <p><strong>Phone:</strong> ${this.escapeHtml(data.phone)}</p>
        <p><strong>Email:</strong> ${this.escapeHtml(data.email)}</p>
        <p><strong>Event Type:</strong> ${this.escapeHtml(data.eventType)}</p>
        <p><strong>Event Date:</strong> ${data.eventDate}</p>
        <p><strong>Guests:</strong> ${data.estimatedGuests}</p>
        <p><strong>Preferred Package:</strong> ${this.escapeHtml(data.preferredPackage)}</p>
        <p><strong>Fulfilment:</strong> ${data.fulfilmentType}</p>
        <p><strong>Notes:</strong> ${this.escapeHtml(data.notes || 'None')}</p>`;
    } else if (type === 'order') {
      subject = `New Order Placed – ${data.orderRef}`;
      const itemsHtml = data.orderItems.map((i: any) => `<li>${this.escapeHtml(i.name)} x${i.quantity}</li>`).join('');
      content = `
        <h3>New Order Received – ${data.orderRef}</h3>
        <p><strong>Customer:</strong> ${this.escapeHtml(data.name)}</p>
        <p><strong>Phone:</strong> ${this.escapeHtml(data.phone)}</p>
        <p><strong>Email:</strong> ${this.escapeHtml(data.email)}</p>
        <p><strong>Fulfilment:</strong> ${data.fulfilmentType}</p>
        ${data.fulfilmentType === 'Delivery' ? `<p><strong>Delivery Address:</strong> ${this.escapeHtml(data.deliveryAddress)}</p>` : ''}
        <p><strong>Required Date/Time:</strong> ${data.dateNeeded} ${data.timeNeeded}</p>
        <h4>Items Ordered:</h4>
        <ul>${itemsHtml}</ul>
        <p><strong>Total Amount:</strong> R${data.totalAmount.toFixed(2)}</p>`;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      ${this.getHeader()}
    </head>
    <body>
      <div class="container">
        <h2>New ${type.charAt(0).toUpperCase() + type.slice(1)} Notification</h2>
        ${content}
        <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E9D6B4;">
          <a href="https://dimphokelesego.com/admin" class="btn">View in Admin Panel</a>
        </p>
      </div>
    </body>
    </html>`;

    return { subject, html };
  }
}
