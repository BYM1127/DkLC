using System;

namespace DimphoKeLesegoCateringBackend.Models
{
    public class BookingRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string EventDate { get; set; } = string.Empty; // ISO Date string e.g. "2026-07-15"
        public int EstimatedGuests { get; set; }
        public string PreferredPackage { get; set; } = string.Empty;
        public string FulfilmentType { get; set; } = string.Empty; // "Delivery" or "Collection"
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // "Pending", "Confirmed", "Cancelled"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
