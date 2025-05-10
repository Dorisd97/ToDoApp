using ToDoApp.Models;

namespace ToDoApp.Services
{
    public class ToDoService
    {
        private readonly List<ToDoItem> _items = new();
        private int _nextId = 1;

        public IEnumerable<ToDoItem> GetAll() => _items;

        public ToDoItem? Get(int id) => _items.FirstOrDefault(x => x.Id == id);

        public void Add(ToDoItem item)
        {
            item.Id = _nextId++;
            _items.Add(item);
        }

        public void Update(ToDoItem item)
        {
            var index = _items.FindIndex(x => x.Id == item.Id);
            if (index != -1) _items[index] = item;
        }

        public void Delete(int id) => _items.RemoveAll(x => x.Id == id);
    }
}
