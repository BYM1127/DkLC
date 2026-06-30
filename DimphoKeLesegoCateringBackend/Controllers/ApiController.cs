using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DimphoKeLesegoCateringBackend.Data;
using DimphoKeLesegoCateringBackend.Models;
using DimphoKeLesegoCateringBackend.Services;

namespace DimphoKeLesegoCateringBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class ApiController : ControllerBase
    {
        private readonly CateringDbContext _context;
        private readonly EmailService _emailService;

        public ApiController(CateringDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST /api/contacts
        [HttpPost("contacts")]
        public async Task<IActionResult> CreateContact([FromBody] ContactMessage message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Name) || string.IsNullOrWhiteSpace(message.Message))
            {
                return BadRequest(new { message = "Name and Message are required." });
            }

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, id = message.Id });
        }

        // POST /api/bookings
        [HttpPost("bookings")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest booking)
        {
            if (booking == null || string.IsNullOrWhiteSpace(booking.Name) || string.IsNullOrWhiteSpace(booking.Phone))
            {
                return BadRequest(new { message = "Name and Phone are required." });
            }

            // Check if date is blocked
            bool isBlocked = await _context.BlockedDates
                .AnyAsync(bd => bd.Date == booking.EventDate);

            if (isBlocked)
            {
                return BadRequest(new { message = "Sorry, we are fully booked on this date. Please select another date." });
            }

            booking.Status = "Pending";
            booking.CreatedAt = DateTime.UtcNow;

            _context.BookingRequests.Add(booking);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, id = booking.Id });
        }

        // GET /api/availability/blocked-dates
        [HttpGet("availability/blocked-dates")]
        public async Task<IActionResult> GetBlockedDates()
        {
            var dates = await _context.BlockedDates
                .Select(bd => bd.Date)
                .ToListAsync();
            return Ok(dates);
        }

        // GET /api/coupons/validate
        [HttpGet("coupons/validate")]
        public async Task<IActionResult> ValidateCoupon([FromQuery] string code, [FromQuery] decimal amount)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest(new { message = "Coupon code is required." });
            }

            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == code.Trim().ToUpper() && c.IsActive);

            if (coupon == null)
            {
                return Ok(new { valid = false, message = "Invalid or expired coupon code." });
            }

            decimal discount = 0;
            if (coupon.DiscountType == "Percentage")
            {
                discount = amount * (coupon.Value / 100m);
            }
            else if (coupon.DiscountType == "Fixed")
            {
                discount = coupon.Value;
            }

            // Ensure discount doesn't exceed total amount
            discount = Math.Min(discount, amount);
            decimal newTotal = amount - discount;

            return Ok(new { 
                valid = true, 
                discount = Math.Round(discount, 2), 
                newTotal = Math.Round(newTotal, 2),
                code = coupon.Code
            });
        }

        // POST /api/orders
        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequestDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Phone))
            {
                return BadRequest(new { message = "Name and Phone number are required." });
            }

            if (dto.Items == null || dto.Items.Count == 0)
            {
                return BadRequest(new { message = "Order cart is empty." });
            }

            // Calculate totals
            decimal originalAmount = dto.Items.Sum(i => i.Price * i.Quantity);
            decimal discountAmount = 0;
            string appliedCoupon = string.Empty;

            if (!string.IsNullOrWhiteSpace(dto.CouponApplied))
            {
                var coupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.CouponApplied.Trim().ToUpper() && c.IsActive);

                if (coupon != null)
                {
                    appliedCoupon = coupon.Code;
                    if (coupon.DiscountType == "Percentage")
                    {
                        discountAmount = originalAmount * (coupon.Value / 100m);
                    }
                    else if (coupon.DiscountType == "Fixed")
                    {
                        discountAmount = coupon.Value;
                    }
                    discountAmount = Math.Min(discountAmount, originalAmount);
                }
            }

            decimal totalAmount = originalAmount - discountAmount;
            string orderRef = "DKL-" + new Random().Next(100000, 999999).ToString();

            var order = new Order
            {
                OrderRef = orderRef,
                Name = dto.Name.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email?.Trim() ?? string.Empty,
                FulfilmentType = dto.FulfilmentType ?? "Delivery",
                DeliveryAddress = dto.DeliveryAddress?.Trim() ?? string.Empty,
                DateNeeded = dto.DateNeeded ?? string.Empty,
                TimeNeeded = dto.TimeNeeded ?? string.Empty,
                Notes = dto.Notes?.Trim() ?? string.Empty,
                OriginalAmount = Math.Round(originalAmount, 2),
                DiscountAmount = Math.Round(discountAmount, 2),
                TotalAmount = Math.Round(totalAmount, 2),
                CouponApplied = appliedCoupon,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            foreach (var item in dto.Items)
            {
                order.OrderItems.Add(new OrderItem
                {
                    ItemId = item.ItemId,
                    Name = item.Name,
                    Price = Math.Round(item.Price, 2),
                    Quantity = item.Quantity,
                    IsPackage = item.IsPackage
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Simulate sending order confirmation email (creates a local HTML file in wwwroot/logs/emails)
            _emailService.SendOrderConfirmationEmail(order);

            return Ok(new { 
                success = true, 
                orderRef = order.OrderRef, 
                total = order.TotalAmount,
                discount = order.DiscountAmount
            });
        }

        // GET /api/bookings/lookup/{id}
        [HttpGet("bookings/lookup/{id}")]
        public async Task<IActionResult> LookupBooking(int id)
        {
            var booking = await _context.BookingRequests.FindAsync(id);

            if (booking == null)
            {
                return NotFound(new { message = "Booking request not found." });
            }

            return Ok(new {
                id = booking.Id,
                name = booking.Name,
                phone = booking.Phone,
                email = booking.Email,
                eventType = booking.EventType,
                eventDate = booking.EventDate,
                estimatedGuests = booking.EstimatedGuests,
                preferredPackage = booking.PreferredPackage,
                fulfilmentType = booking.FulfilmentType,
                notes = booking.Notes,
                status = booking.Status,
                createdAt = booking.CreatedAt
            });
        }

        // GET /api/orders/lookup/{ref}
        [HttpGet("orders/lookup/{ref}")]
        public async Task<IActionResult> LookupOrder(string @ref)
        {
            if (string.IsNullOrWhiteSpace(@ref))
            {
                return BadRequest(new { message = "Order reference is required." });
            }

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderRef.ToUpper() == @ref.Trim().ToUpper());

            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            return Ok(new {
                orderRef = order.OrderRef,
                name = order.Name,
                status = order.Status,
                dateNeeded = order.DateNeeded,
                timeNeeded = order.TimeNeeded,
                fulfilmentType = order.FulfilmentType,
                deliveryAddress = order.DeliveryAddress,
                notes = order.Notes,
                originalAmount = order.OriginalAmount,
                discountAmount = order.DiscountAmount,
                totalAmount = order.TotalAmount,
                couponApplied = order.CouponApplied,
                items = order.OrderItems.Select(i => new {
                    itemId = i.ItemId,
                    name = i.Name,
                    price = i.Price,
                    quantity = i.Quantity,
                    isPackage = i.IsPackage
                })
            });
        }
    }

    // DTO Classes
    public class OrderRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FulfilmentType { get; set; } = "Delivery";
        public string DeliveryAddress { get; set; } = string.Empty;
        public string DateNeeded { get; set; } = string.Empty;
        public string TimeNeeded { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string CouponApplied { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public string ItemId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsPackage { get; set; }
    }
}
