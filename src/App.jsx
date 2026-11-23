import { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  function loadItems(type) {
    fetch(`http://localhost:5284/inventory/${type}`)
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Помилка предметів', error));
  }
  function deleteItem(id) {
    fetch(`http://localhost:5284/inventory/${id}`, {
      method: `DELETE`
    })
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Помилка видалення:', error))
  }

  useEffect(() => {
    loadItems('All');

    fetch('http://localhost:5284/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Помилка категорії', error));

  }, []);

  return (
    <div>
      <h1>Арсенал </h1>
      <div className="filter-container">
        <button onClick={() => loadItems('All')}>Всі предмети</button>
        {categories.map(categories =>
          <button key={categories.id} onClick={() => loadItems(categories.name)}>
            {categories.name}
          </button>
        )}
      </div>

      <div className="inventory-container">
        {items.map(item => (
          <div key={items.id} className="card">
            <h3>{items.name}</h3>
            <p className="item-name">{item.name}</p>
            <p className="item-type">{item.category?.name}</p>
            <p className="wear">{item.wear}</p>
            <p className="price">{item.price}</p>
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
