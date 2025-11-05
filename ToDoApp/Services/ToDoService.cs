using ToDoApp.Models;

namespace ToDoApp.Services
{
    public class ToDoService
    {
        // In-memory "database"
        private static List<ToDoItem> _tasks = new List<ToDoItem>();
        private static int _nextId = 1;

        public List<ToDoItem> GetAll() => _tasks;

        public ToDoItem? GetById(int id) => _tasks.FirstOrDefault(t => t.Id == id);

        public ToDoItem Add(ToDoItem newItem)
        {
            newItem.Id = _nextId++;
            _tasks.Add(newItem);
            return newItem;
        }

        public bool Delete(int id)
        {
            var task = GetById(id);
            if (task == null)
            {
                return false;
            }
            _tasks.Remove(task);
            return true;
        }
    }
}
