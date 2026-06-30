namespace DimphoKeLesegoCateringBackend.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string ItemId { get; set; } = string.Empty; // e.g. "oxtail-stew"
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsPackage { get; set; }
    }
}
