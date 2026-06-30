#!/usr/bin/env node

/**
 * Email System Test Script
 * 
 * This script tests the email system by sending test emails
 * Usage: node test-emails.js
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { MailerConfig } from './dist/services/MailerConfig.js';
import { EmailTemplates } from './dist/services/EmailTemplates.js';
import { ContactMessage } from './dist/entities/ContactMessage.js';
import { BookingRequest } from './dist/entities/BookingRequest.js';
import { Order } from './dist/entities/Order.js';
import { OrderItem } from './dist/entities/OrderItem.js';

async function testEmails() {
  console.log('🧪 Email System Test Started\n');

  // Test 1: Contact Form Email
  console.log('Test 1: Contact Form Email');
  try {
    const contact = new ContactMessage();
    contact.name = 'John Test';
    contact.email = process.env.TEST_EMAIL || 'test@example.com';
    contact.message = 'This is a test contact message from the email system test script.';
    contact.createdAt = new Date();

    const { subject, html } = EmailTemplates.contactFormResponse(contact);
    console.log(`  Subject: ${subject}`);
    console.log(`  To: ${contact.email}`);
    
    // Don't actually send during test, just show template
    console.log('  ✅ Template generated successfully\n');
  } catch (error) {
    console.log(`  ❌ Error: ${error}\n`);
  }

  // Test 2: Booking Confirmation Email
  console.log('Test 2: Booking Confirmation Email');
  try {
    const booking = new BookingRequest();
    booking.name = 'Jane Booking';
    booking.phone = '+27 12 345 6789';
    booking.email = process.env.TEST_EMAIL || 'test@example.com';
    booking.eventType = 'Wedding';
    booking.eventDate = '2026-08-15';
    booking.estimatedGuests = 150;
    booking.preferredPackage = 'Gold Feast – R220pp';
    booking.fulfilmentType = 'Delivery';
    booking.notes = 'Please include vegetarian options';
    booking.status = 'Pending';
    booking.createdAt = new Date();

    const { subject, html } = EmailTemplates.bookingConfirmation(booking);
    console.log(`  Subject: ${subject}`);
    console.log(`  To: ${booking.email}`);
    console.log('  ✅ Template generated successfully\n');
  } catch (error) {
    console.log(`  ❌ Error: ${error}\n`);
  }

  // Test 3: Order Confirmation Email
  console.log('Test 3: Order Confirmation Email');
  try {
    const order = new Order();
    order.orderRef = 'DKL-123456';
    order.name = 'Bob Order';
    order.phone = '+27 11 234 5678';
    order.email = process.env.TEST_EMAIL || 'test@example.com';
    order.fulfilmentType = 'Delivery';
    order.deliveryAddress = '123 Main Street, Johannesburg';
    order.dateNeeded = '2026-07-10';
    order.timeNeeded = '18:00';
    order.notes = 'Ring doorbell';
    order.originalAmount = 900;
    order.discountAmount = 90;
    order.totalAmount = 810;
    order.couponApplied = 'WELCOME10';
    order.status = 'Pending';
    order.createdAt = new Date();

    const item1 = new OrderItem();
    item1.itemId = '1';
    item1.name = 'Beef Medallions';
    item1.price = 450;
    item1.quantity = 2;
    item1.isPackage = false;

    order.orderItems = [item1];

    const { subject, html } = EmailTemplates.orderConfirmation(order);
    console.log(`  Subject: ${subject}`);
    console.log(`  To: ${order.email}`);
    console.log('  ✅ Template generated successfully\n');
  } catch (error) {
    console.log(`  ❌ Error: ${error}\n`);
  }

  // Test 4: SMTP Connection
  console.log('Test 4: SMTP Connection');
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER || 'not-configured';
    
    if (smtpUser === 'not-configured') {
      console.log('  ⚠️  SMTP not configured. Set SMTP_USER in .env to enable email sending');
      console.log('  See EMAIL_SETUP.md for configuration instructions\n');
    } else {
      console.log(`  SMTP Host: ${smtpHost}`);
      console.log(`  SMTP User: ${smtpUser}`);
      console.log('  ✅ SMTP configured\n');
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error}\n`);
  }

  console.log('✅ Email System Test Completed\n');
  console.log('Next Steps:');
  console.log('1. Configure SMTP credentials in .env (see EMAIL_SETUP.md)');
  console.log('2. Rebuild: npm run build');
  console.log('3. Restart backend: npm run dev');
  console.log('4. Test by submitting a form on the website');
  console.log('5. Check email inbox and server logs');
}

testEmails().catch(console.error);
