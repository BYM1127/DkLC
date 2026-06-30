# WhatsApp Click-to-Chat Setup

This project now uses the free WhatsApp click-to-chat method. No Twilio account is required.

## How It Works

1. A customer places an order on the website.
2. The backend saves the order and creates an order reference.
3. The success screen shows a `Send Order on WhatsApp` button.
4. The customer taps the button, WhatsApp opens with the order message already filled in, and the customer taps Send.

This is free because the website is not sending an automated WhatsApp message. It is preparing the message for the customer to send.

## Environment Variables

```env
ADMIN_WHATSAPP_NUMBER=+27796929591
WHATSAPP_NUMBER=27796929591
```

`ADMIN_WHATSAPP_NUMBER` is the business number that receives order messages.

## Logs

The backend also logs prepared WhatsApp messages:

```text
DimphoKeLesegoCateringBackend/wwwroot/logs/whatsapp/
```

On Vercel, logs are written to `/tmp/whatsapp` and are temporary.

## Important Limitation

This method cannot silently send a WhatsApp message to the customer. WhatsApp does not allow free automatic sending from a normal website. The customer must tap the button and press Send inside WhatsApp.
