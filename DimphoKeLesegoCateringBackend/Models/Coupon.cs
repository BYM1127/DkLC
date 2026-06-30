namespace DimphoKeLesegoCateringBackend.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // e.g. "WELCOME10"
        public string DiscountType { get; set; } = "Percentage"; // "Percentage" or "Fixed"
        public decimal Value { get; set; } // 10 for 10% or 50 for R50
        public bool IsActive { get; set; } = true;
    }
}
