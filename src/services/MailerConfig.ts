import nodemailer from 'nodemailer';

export class MailerConfig {
  private static transporter: any;

  static getTransporter() {
    if (!this.transporter) {
      const host = process.env.SMTP_HOST || 'smtp.gmail.com';
      const port = parseInt(process.env.SMTP_PORT || '587');
      const user = process.env.SMTP_USER;
      const password = process.env.SMTP_PASSWORD;

      // Only create transporter if credentials are provided
      if (user && password) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465, // true for 465, false for other ports
          auth: {
            user,
            pass: password,
          },
        });
      } else {
        // Development: use test account
        console.warn('No SMTP credentials provided. Using test transport.');
        this.transporter = nodemailer.createTestAccount().then((testAccount: any) => {
          return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        });
      }
    }
    return this.transporter;
  }

  static async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const transporter = await this.getTransporter();
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@dimphokelesego.com',
        to,
        subject,
        html,
        text: text || 'Please view this email in HTML format.',
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
