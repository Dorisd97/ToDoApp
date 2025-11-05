namespace ToDoApp.Models
{
    public class ToDoItem
    {
        public int Id { get; set; }
        public string? Title { get; set; } // string? allows for null values
        public bool IsCompleted { get; set; }
    }
}
