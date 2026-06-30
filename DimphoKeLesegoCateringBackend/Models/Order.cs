using System;
using System.Collections.Generic;

namespace DimphoKeLesegoCateringBackend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderRef { get; set; } = string.Empty; // e.g. DKL-123456
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FulfilmentType { get; set; } = string.Empty; // "Delivery" or "Collection"
        public string DeliveryAddress { get; set; } = string.Empty;
        public string DateNeeded { get; set; } = string.Empty; // "2026-07-15"
        public string TimeNeeded { get; set; } = string.Empty; // "14:30"
        public string Notes { get; set; } = string.Empty;
        public decimal OriginalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string CouponApplied { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // "Pending", "Preparing", "Ready for Collection/Delivery", "Completed", "Cancelled"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
