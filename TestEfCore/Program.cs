using System;
using ezTravel.Libs;
using Microsoft.EntityFrameworkCore;

class Program
{
    static void Main()
    {
        try
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=test;Trusted_Connection=True;");
            
            using var context = new AppDbContext(optionsBuilder.Options);
            // Accessing Model forces OnModelCreating to execute
            var model = context.Model;
            Console.WriteLine("DbContext initialized successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("EXCEPTION: " + ex.ToString());
        }
    }
}
