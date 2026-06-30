namespace DimphoKeLesegoCateringBackend.Models
{
    public class BlockedDate
    {
        public int Id { get; set; }
        public string Date { get; set; } = string.Empty; // "2026-07-04"
        public string Reason { get; set; } = string.Empty;
    }
}
