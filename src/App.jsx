import { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  const [name, setName] = useState('')
  const [CategoryId, setCategoryId] = useState('')
  const [wear, setWear] = useState('')
  const [price, setPrice] = useState('')

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

  function addItem(e) {
    e.preventDefault();

    const newItem = {
      name: name,
      CategoryId: Number(CategoryId),
      wear: Number(wear),
      price: Number(price)
    };
    fetch('http://localhost:5284/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
      .then(res => {
        if (res.ok) {
          loadItems('All');
          setName('');
          setCategoryId('');
          setWear('');
          setPrice('');
        }
      })
      .catch(err => console.error('Помиилка створення', err));
  }


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
      <form className="add-form" onSubmit={addItem}>
        <input
          type="text"
          placeholder="Назва зброї"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        ></input>
        <select
          value={CategoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Оберіть тип</option>
          {categories.map(category =>
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          )}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Знос"
          value={wear}
          onChange={e => setWear(e.target.value)}
          required
        ></input>
        <input
          type="number"
          placeholder="Ціна"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        ></input>
        <button type="submit"> Додати зброю</button>
      </form>

      <div className="inventory-container">
        {items.map(item => (
          <div key={item.id} className="card">
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
