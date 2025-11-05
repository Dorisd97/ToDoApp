using Microsoft.AspNetCore.Mvc;
using ToDoApp.Models;
using ToDoApp.Services;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Sets the base route to "api/todo"
    public class ToDoController : ControllerBase
    {
        private readonly ToDoService _todoService;

        // Use dependency injection to get an instance of the service
        public ToDoController(ToDoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public IActionResult GetTasks()
        {
            return Ok(_todoService.GetAll());
        }

        [HttpPost]
        public IActionResult AddTask([FromBody] ToDoItem task)
        {
            if (task == null || string.IsNullOrWhiteSpace(task.Title))
            {
                return BadRequest("Task title is required.");
            }

            var newTask = _todoService.Add(task);
            // Returns a 201 Created status with the location of the new resource
            return CreatedAtAction(nameof(GetTasks), new { id = newTask.Id }, newTask);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            if (_todoService.Delete(id))
            {
                // Returns a 204 No Content status, indicating success with no body
                return NoContent();
            }

            // Returns a 404 Not Found status if the task doesn't exist
            return NotFound();
        }
    }
}
