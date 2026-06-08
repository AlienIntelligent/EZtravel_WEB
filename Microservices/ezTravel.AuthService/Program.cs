using ezTravel.Repository;
using ezTravel.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRepositories(builder.Configuration);
builder.Services.AddServices();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
