using ezTravel.Repository;
using ezTravel.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure & Services
builder.Services.AddRepositories(builder.Configuration);
builder.Services.AddServices();

// 2. Add Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 3. Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
