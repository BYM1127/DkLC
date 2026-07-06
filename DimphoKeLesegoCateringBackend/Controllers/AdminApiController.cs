using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DimphoKeLesegoCateringBackend.Data;
using DimphoKeLesegoCateringBackend.Models;

namespace DimphoKeLesegoCateringBackend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminApiController : ControllerBase, Microsoft.AspNetCore.Mvc.Filters.IActionFilter
    {
        private readonly CateringDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminApiController(CateringDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [NonAction]
        public void OnActionExecuting(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context)
        {
            var expectedKey = _configuration["ADMIN_API_KEY"];
            if (!string.IsNullOrEmpty(expectedKey))
            {
                if (!context.HttpContext.Request.Headers.TryGetValue("x-admin-api-key", out var suppliedKey) && 
                    !context.HttpContext.Request.Headers.TryGetValue("Authorization", out suppliedKey))
                {
                    context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized: API Key missing" });
                    return;
                }

                var keyString = suppliedKey.ToString();
                if (keyString.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    keyString = keyString.Substring(7);
                }

                if (keyString != expectedKey)
                {
                    context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized: Invalid API Key" });
                    return;
                }
            }
        }

        [NonAction]
        public void OnActionExecuted(Microsoft.AspNetCore.Mvc.Filters.ActionExecutedContext context)
        {
        }

        // GET /api/admin/contacts
        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await _context.ContactMessages
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            return Ok(contacts);
        }

        // GET /api/admin/bookings
        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            var bookings = await _context.BookingRequests
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            return Ok(bookings);
        }

        // PUT /api/admin/bookings/{id}/status
        [HttpPut("bookings/{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
            {
                return BadRequest(new { message = "Status is required." });
            }

            var booking = await _context.BookingRequests.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            booking.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, status = booking.Status });
        }

        // GET /api/admin/orders
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new {
                    o.Id,
                    o.OrderRef,
                    o.Name,
                    o.Phone,
                    o.Email,
                    o.FulfilmentType,
                    o.DeliveryAddress,
                    o.DateNeeded,
                    o.TimeNeeded,
                    o.Notes,
                    o.OriginalAmount,
                    o.DiscountAmount,
                    o.TotalAmount,
                    o.CouponApplied,
                    o.Status,
                    o.CreatedAt,
                    items = o.OrderItems.Select(i => new {
                        i.Name,
                        i.Price,
                        i.Quantity,
                        i.IsPackage
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // PUT /api/admin/orders/{id}/status
        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
            {
                return BadRequest(new { message = "Status is required." });
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, status = order.Status });
        }

        // POST /api/admin/availability/block
        [HttpPost("availability/block")]
        public async Task<IActionResult> BlockDate([FromBody] BlockedDate dateModel)
        {
            if (dateModel == null || string.IsNullOrWhiteSpace(dateModel.Date))
            {
                return BadRequest(new { message = "Date is required." });
            }

            bool exists = await _context.BlockedDates.AnyAsync(bd => bd.Date == dateModel.Date);
            if (exists)
            {
                return BadRequest(new { message = "Date is already blocked." });
            }

            _context.BlockedDates.Add(dateModel);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, date = dateModel.Date });
        }

        // DELETE /api/admin/availability/block/{date}
        [HttpDelete("availability/block/{date}")]
        public async Task<IActionResult> UnblockDate(string date)
        {
            if (string.IsNullOrWhiteSpace(date))
            {
                return BadRequest(new { message = "Date is required." });
            }

            var blocked = await _context.BlockedDates.FirstOrDefaultAsync(bd => bd.Date == date);
            if (blocked == null)
            {
                return NotFound(new { message = "Blocked date not found." });
            }

            _context.BlockedDates.Remove(blocked);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        // GET /api/admin/coupons
        [HttpGet("coupons")]
        public async Task<IActionResult> GetCoupons()
        {
            var coupons = await _context.Coupons
                .OrderBy(c => c.Id)
                .ToListAsync();
            return Ok(coupons);
        }

        // POST /api/admin/coupons
        [HttpPost("coupons")]
        public async Task<IActionResult> CreateCoupon([FromBody] CouponDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new { message = "Coupon code is required." });
            }

            bool exists = await _context.Coupons
                .AnyAsync(c => c.Code.ToUpper() == dto.Code.Trim().ToUpper());

            if (exists)
            {
                return BadRequest(new { message = "A coupon with this code already exists." });
            }

            var coupon = new Coupon
            {
                Code = dto.Code.Trim().ToUpper(),
                DiscountType = dto.DiscountType == "Fixed" ? "Fixed" : "Percentage",
                Value = dto.Value,
                IsActive = dto.IsActive
            };

            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, id = coupon.Id });
        }

        // PUT /api/admin/coupons/{id}/toggle
        [HttpPut("coupons/{id}/toggle")]
        public async Task<IActionResult> ToggleCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
            {
                return NotFound(new { message = "Coupon not found." });
            }

            coupon.IsActive = !coupon.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, isActive = coupon.IsActive });
        }

        // DELETE /api/admin/coupons/{id}
        [HttpDelete("coupons/{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
            {
                return NotFound(new { message = "Coupon not found." });
            }

            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CouponDto
    {
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percentage"; // "Percentage" or "Fixed"
        public decimal Value { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
