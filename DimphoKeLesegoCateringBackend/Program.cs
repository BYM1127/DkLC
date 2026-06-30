using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DimphoKeLesegoCateringBackend.Data;
using DimphoKeLesegoCateringBackend.Services;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure EF Core SQLite Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=catering.db";
builder.Services.AddDbContext<CateringDbContext>(options =>
    options.UseSqlite(connectionString));

// Register EmailService using the web root path
builder.Services.AddSingleton<EmailService>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    // If WebRootPath is null, default to a directory inside the current folder
    var path = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    if (!Directory.Exists(path))
    {
        Directory.CreateDirectory(path);
    }
    return new EmailService(path);
});

// Configure CORS to allow anything locally
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Ensure Database and Seed Data are created on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CateringDbContext>();
    // Creates database if it doesn't exist, and seeds it
    context.Database.EnsureCreated();
}

app.UseCors("AllowAll");

// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
