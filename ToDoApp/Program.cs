using ToDoApp.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
var devCorsPolicy = "DevCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: devCorsPolicy,
                      policy =>
                      {
                          // Replace with your React app's URL
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Register the ToDoService for dependency injection
builder.Services.AddSingleton<ToDoService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Use the specific policy in development
    app.UseCors(devCorsPolicy);
}
else
{
    // In production, you might want a more restrictive policy
    app.UseCors("AllowAll"); // Or whatever your production policy is
}

app.UseHttpsRedirection();

// Enable serving of static files from wwwroot
app.UseStaticFiles();

// Enable the CORS policy
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.File("index.html", "text/html", "wwwroot"));

app.Run();