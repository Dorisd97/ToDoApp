using ToDoApp.Models;
using ToDoApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<ToDoService>();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.)
app.UseSwagger();

// Enable middleware to serve Swagger JSON endpoint
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = "swagger"; // Swagger UI at root URL
});

// Map API endpoints
app.MapGet("/api/todos", (ToDoService service) =>
    Results.Ok(service.GetAll()));

app.MapGet("/api/todos/{id}", (int id, ToDoService service) =>
    service.Get(id) is ToDoItem item ? Results.Ok(item) : Results.NotFound());

app.MapPost("/api/todos", (ToDoItem item, ToDoService service) =>
{
    service.Add(item);
    return Results.Created($"/api/todos/{item.Id}", item);
});

app.MapPut("/api/todos/{id}", (int id, ToDoItem input, ToDoService service) =>
{
    var existing = service.Get(id);
    if (existing is null) return Results.NotFound();
    input.Id = id;
    service.Update(input);
    return Results.NoContent();
});

app.MapDelete("/api/todos/{id}", (int id, ToDoService service) =>
{
    service.Delete(id);
    return Results.NoContent();
});

app.UseHttpsRedirection();
app.UseStaticFiles();  // This enables serving static files like HTML, CSS, and JS
app.Run();
