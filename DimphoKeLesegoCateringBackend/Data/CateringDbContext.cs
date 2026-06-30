using Microsoft.EntityFrameworkCore;
using DimphoKeLesegoCateringBackend.Models;

namespace DimphoKeLesegoCateringBackend.Data
{
    public class CateringDbContext : DbContext
    {
        public CateringDbContext(DbContextOptions<CateringDbContext> options) : base(options)
        {
        }

        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<BookingRequest> BookingRequests => Set<BookingRequest>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Coupon> Coupons => Set<Coupon>();
        public DbSet<BlockedDate> BlockedDates => Set<BlockedDate>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for Order and OrderItem
            modelBuilder.Entity<Order>()
                .Property(o => o.OriginalAmount)
                .HasConversion<double>();
            
            modelBuilder.Entity<Order>()
                .Property(o => o.DiscountAmount)
                .HasConversion<double>();

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasConversion<double>();

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasConversion<double>();

            modelBuilder.Entity<Coupon>()
                .Property(c => c.Value)
                .HasConversion<double>();

            // Seed initial coupons
            modelBuilder.Entity<Coupon>().HasData(
                new Coupon { Id = 1, Code = "WELCOME10", DiscountType = "Percentage", Value = 10, IsActive = true },
                new Coupon { Id = 2, Code = "DKL50", DiscountType = "Fixed", Value = 50, IsActive = true }
            );
        }
    }
}
