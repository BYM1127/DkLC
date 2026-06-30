using System;
using System.IO;
using System.Text;
using DimphoKeLesegoCateringBackend.Models;

namespace DimphoKeLesegoCateringBackend.Services
{
    public class EmailService
    {
        private readonly string _webRootPath;

        public EmailService(string webRootPath)
        {
            _webRootPath = webRootPath;
        }

        public void SendOrderConfirmationEmail(Order order)
        {
            try
            {
                var sb = new StringBuilder();
                sb.AppendLine("<!DOCTYPE html>");
                sb.AppendLine("<html>");
                sb.AppendLine("<head>");
                sb.AppendLine("  <meta charset='utf-8'>");
                sb.AppendLine("  <title>Order Confirmation " + order.OrderRef + "</title>");
                sb.AppendLine("  <style>");
                sb.AppendLine("    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FFF8EF; color: #2A1B12; padding: 20px; line-height: 1.6; }");
                sb.AppendLine("    .container { max-width: 600px; margin: 0 auto; background: #FBF1E2; border: 1.5px solid #E9D6B4; border-radius: 6px; padding: 30px; box-shadow: 0 4px 12px rgba(42,27,18,0.08); }");
                sb.AppendLine("    h2 { color: #5F0C0C; border-bottom: 2px solid #C2902F; padding-bottom: 10px; margin-top: 0; }");
                sb.AppendLine("    .details { margin-bottom: 20px; }");
                sb.AppendLine("    .item-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }");
                sb.AppendLine("    .item-table th, .item-table td { padding: 10px; border-bottom: 1px dotted #E9D6B4; text-align: left; }");
                sb.AppendLine("    .item-table th { background-color: #5F0C0C; color: #FFF8EF; font-weight: bold; }");
                sb.AppendLine("    .total-row { font-size: 1.2em; font-weight: bold; color: #5F0C0C; text-align: right; margin-top: 15px; }");
                sb.AppendLine("    .footer { text-align: center; font-size: 0.85em; color: #6B5A48; margin-top: 30px; border-top: 1px solid #E9D6B4; padding-top: 15px; }");
                sb.AppendLine("  </style>");
                sb.AppendLine("</head>");
                sb.AppendLine("<body>");
                sb.AppendLine("  <div class='container'>");
                sb.AppendLine("    <h2>Order Confirmation - " + order.OrderRef + "</h2>");
                sb.AppendLine("    <p>Dear " + order.Name + ",</p>");
                sb.AppendLine("    <p>Thank you for choosing <strong>Dimpho ke Lesego Catering Services</strong>! We have received your order details and are currently reviewing availability.</p>");
                sb.AppendLine("    ");
                sb.AppendLine("    <div class='details'>");
                sb.AppendLine("      <strong>Order Date:</strong> " + order.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss UTC") + "<br>");
                sb.AppendLine("      <strong>Fulfilment:</strong> " + order.FulfilmentType + "<br>");
                if (order.FulfilmentType == "Delivery")
                {
                    sb.AppendLine("      <strong>Delivery Address:</strong> " + order.DeliveryAddress + "<br>");
                }
                sb.AppendLine("      <strong>Required By:</strong> " + order.DateNeeded + " " + order.TimeNeeded + "<br>");
                if (!string.IsNullOrEmpty(order.Notes))
                {
                    sb.AppendLine("      <strong>Special Notes:</strong> " + order.Notes + "<br>");
                }
                sb.AppendLine("    </div>");
                sb.AppendLine("    ");
                sb.AppendLine("    <h3>Your Ordered Items</h3>");
                sb.AppendLine("    <table class='item-table'>");
                sb.AppendLine("      <thead>");
                sb.AppendLine("        <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>");
                sb.AppendLine("      </thead>");
                sb.AppendLine("      <tbody>");
                
                foreach (var item in order.OrderItems)
                {
                    var unitText = item.IsPackage ? "/guest" : " each";
                    sb.AppendLine("        <tr>");
                    sb.AppendLine("          <td>" + item.Name + "</td>");
                    sb.AppendLine("          <td>R" + item.Price + unitText + "</td>");
                    sb.AppendLine("          <td>" + item.Quantity + "</td>");
                    sb.AppendLine("          <td>R" + (item.Price * item.Quantity) + "</td>");
                    sb.AppendLine("        </tr>");
                }

                sb.AppendLine("      </tbody>");
                sb.AppendLine("    </table>");
                sb.AppendLine("    ");
                
                if (order.OriginalAmount != order.TotalAmount)
                {
                    sb.AppendLine("    <div style='text-align:right; font-size:0.95em;'>");
                    sb.AppendLine("      Original Subtotal: R" + order.OriginalAmount + "<br>");
                    sb.AppendLine("      Discount (" + order.CouponApplied + "): -R" + order.DiscountAmount + "<br>");
                    sb.AppendLine("    </div>");
                }
                sb.AppendLine("    <div class='total-row'>Estimated Total: R" + order.TotalAmount + "</div>");
                sb.AppendLine("    ");
                sb.AppendLine("    <p>We will contact you within 24 hours at <strong>" + order.Phone + "</strong> or via email (<strong>" + order.Email + "</strong>) to confirm event details, delivery fees, and secure payment terms.</p>");
                sb.AppendLine("    ");
                sb.AppendLine("    <div class='footer'>");
                sb.AppendLine("      &copy; 2026 Dimpho ke Lesego Catering Services.<br>");
                sb.AppendLine("      Phaphadi, Mamaila Village, 0832 &middot; +27 79 692 9591");
                sb.AppendLine("    </div>");
                sb.AppendLine("  </div>");
                sb.AppendLine("</body>");
                sb.AppendLine("</html>");

                // Ensure the output logs folder exists
                string emailLogDir = Path.Combine(_webRootPath, "logs", "emails");
                if (!Directory.Exists(emailLogDir))
                {
                    Directory.CreateDirectory(emailLogDir);
                }

                string fileName = "Email_" + order.OrderRef + "_" + DateTime.UtcNow.Ticks + ".html";
                string fullPath = Path.Combine(emailLogDir, fileName);

                File.WriteAllText(fullPath, sb.ToString(), Encoding.UTF8);
                Console.WriteLine("Simulated Order Confirmation Email saved to: " + fullPath);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to simulate email: " + ex.Message);
            }
        }
    }
}
