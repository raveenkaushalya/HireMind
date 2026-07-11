var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => "HireMind API");

app.Run();
