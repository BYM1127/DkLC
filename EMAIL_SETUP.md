# Email System Documentation

## Overview

The Dimpho ke Lesego Catering website has a comprehensive email system that sends automated transactional emails to customers and admin notifications to the business.

## Email Types

### 1. **Contact Form Response**
- **Sent to:** Customer (person who submitted the form)
- **Sent to Admin:** Admin notification
- **Triggered:** When someone submits the contact form
- **Content:** Acknowledgment that the message was received, with copy of their message

### 2. **Booking Confirmation**
- **Sent to:** Customer (event booker)
- **Sent to Admin:** Admin notification
- **Triggered:** When a booking request is submitted
- **Content:** Event details, what happens next, contact information for follow-up

### 3. **Order Confirmation**
- **Sent to:** Customer (person placing the order)
- **Sent to Admin:** Admin notification
- **Triggered:** When an online order is placed
- **Content:** Order items, pricing breakdown, delivery/collection details, expected contact time

## Setup Instructions

### Prerequisites
- Node.js email sending requires SMTP credentials
- Recommended: Use Gmail with App Password or SendGrid

### Step 1: Generate Email Credentials

#### Option A: Gmail (Recommended for Development)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Copy the generated 16-character password
4. Use these in your `.env` file:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

#### Option B: SendGrid (Recommended for Production)
1. Create a SendGrid account at https://sendgrid.com
2. Generate an API key in Settings → API Keys
3. Use these credentials:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=SG.your-api-key-here
   ```

#### Option C: Mailgun
1. Create a Mailgun account at https://www.mailgun.com
2. Get your SMTP credentials from Domain Settings
3. Use these credentials:
   ```
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@your-domain.com
   SMTP_PASSWORD=your-mailgun-password
   ```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env` (if not already done)
2. Fill in the SMTP credentials:
   ```env
   NODE_ENV=production
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=dimphokelesego@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   SMTP_FROM=noreply@dimphokelesego.com
   ADMIN_EMAIL=dimphokelesego@gmail.com
   ```

### Step 3: Verify Email Setup

1. Start the backend server: `npm run dev`
2. Test by submitting the contact form on the website
3. Check if email was received
4. Check server logs for confirmation: `Email sent: [message-id]`

## Development Mode

If you don't have email credentials set up:
- The system will use **Ethereal Email** (test email service)
- Emails are logged to files in `wwwroot/logs/emails/`
- Check server console for test email links:
  ```
  Email sent: [ethereal-test-link]
  ```
- Click the link to view the test email in your browser

## Email Templates

All email templates are in `src/services/EmailTemplates.ts`:

### Contact Response Template
- Professional acknowledgment
- Copy of customer's message
- Direct contact information
- Business signature

### Booking Confirmation Template
- Booking details summary
- Event information
- Next steps (24-hour callback)
- Contact information for urgent questions

### Order Confirmation Template
- Order reference number
- Items ordered with pricing
- Delivery/collection details
- Expected contact timeline
- Branded footer with business info

### Admin Notification Template
- Quick summary of submission
- Customer contact details
- Link to admin panel
- Type: Contact/Booking/Order

## API Endpoints

### Customer Endpoints (Auto-send emails)

**POST /api/contacts**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I want to know about catering for my wedding"
}
```
*Automatically sends confirmation email to customer and admin notification*

**POST /api/bookings**
```json
{
  "name": "Jane Smith",
  "phone": "+27 12 345 6789",
  "email": "jane@example.com",
  "eventType": "Wedding",
  "eventDate": "2026-08-15",
  "estimatedGuests": 150,
  "preferredPackage": "Gold Feast – R220pp",
  "fulfilmentType": "Delivery",
  "notes": "Need vegetarian options"
}
```
*Automatically sends confirmation email to customer and admin notification*

**POST /api/orders**
```json
{
  "name": "Bob Johnson",
  "phone": "+27 11 234 5678",
  "email": "bob@example.com",
  "fulfilmentType": "Delivery",
  "deliveryAddress": "123 Main Street, Johannesburg",
  "dateNeeded": "2026-07-10",
  "timeNeeded": "18:00",
  "notes": "Please ring doorbell",
  "couponApplied": "WELCOME10",
  "items": [
    {
      "itemId": "1",
      "name": "Beef Medallions",
      "price": 450,
      "quantity": 2,
      "isPackage": false
    }
  ]
}
```
*Automatically sends confirmation email to customer and admin notification*

### Admin Endpoints (Manual email sending)

**POST /api/admin/send-email**
```json
{
  "to": "customer@example.com",
  "subject": "Your Booking is Confirmed",
  "html": "<h1>Your event is confirmed</h1><p>We look forward to catering your event...</p>",
  "text": "Your event is confirmed. We look forward to catering your event..."
}
```
*Send custom email from admin panel*

## Troubleshooting

### Emails Not Sending

1. **Check SMTP Credentials**
   ```bash
   # Verify credentials are correct in .env
   cat .env | grep SMTP
   ```

2. **Check Server Logs**
   - Look for "Email sent:" messages
   - Look for "Error sending email:" messages

3. **Check Firewall/Port**
   - SMTP Port 587 (TLS) should be open
   - Port 465 (SSL) alternative

4. **Gmail Specific**
   - Ensure you used App Password (not account password)
   - Check https://myaccount.google.com/security for "Less secure app access"

5. **Development Testing**
   - Check `wwwroot/logs/emails/` for logged emails
   - Look at server console for Ethereal email links

### Email Not Reaching Inbox

1. Check spam/junk folder
2. Verify SMTP_FROM domain has SPF/DKIM records
3. Consider switching to SendGrid or Mailgun for production

## Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use production-grade email provider (SendGrid, Mailgun)
- [ ] Configure SPF and DKIM DNS records
- [ ] Set up admin email notifications to business email
- [ ] Test all three email types (contact, booking, order)
- [ ] Monitor email delivery logs
- [ ] Set up email bounce handling
- [ ] Test email on multiple email clients

## Backend Email Service Functions

```typescript
// Send contact form response and admin notification
await emailService.sendContactFormEmail(contact);

// Send booking confirmation and admin notification
await emailService.sendBookingConfirmationEmail(booking);

// Send order confirmation and admin notification
await emailService.sendOrderConfirmationEmail(order);
```

All email sending is **asynchronous** - the API response is returned immediately while emails are sent in the background. This ensures fast API response times.

## Customizing Email Templates

To customize email templates, edit `src/services/EmailTemplates.ts`:

1. Modify the HTML in the template functions
2. Update colors, logos, or messaging
3. Rebuild: `npm run build`
4. Restart server: `npm run dev`

## Email Logging

For development and debugging, all sent emails are also logged to files:
- Location: `wwwroot/logs/emails/`
- Format: `[type]_[email]_[timestamp].html`
- Example: `order_customer@example.com_1688900123456.html`

These can be viewed directly in a browser for testing.
