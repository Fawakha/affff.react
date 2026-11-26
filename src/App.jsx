import { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editWear, setEditWear] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [name, setName] = useState('')
  const [CategoryId, setCategoryId] = useState('')
  const [wear, setWear] = useState('')
  const [price, setPrice] = useState('')

  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name);
    setEditCategory(item.categoryId);
    setEditWear(item.wear);
    setEditPrice(item.price);
  }
  function saveEdit(id) {
    const updatedItem = {
      name: editName,
      CategoryId: Number(editCategory),
      wear: Number(editWear),
      price: Number(editPrice),
    }
    fetch(`http://localhost:5284/inventory/${id}`, {
      method: `PUT`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    })
      .then(res => {
        if (res.ok) {
          loadItems('All')
          setEditingId(null)
        }
      })
      .catch(err => console.error('Помилка оновлення', err))
  }

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
            {editingId === item.id ? (
              <div>
                <input
                  type='text'
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                ></input>
                <select
                  value={setEditCategory}
                  onChange={e => setEditCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}
                    >{category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={editWear}
                  onChange={e => setEditWear(e.target.value)}
                ></input>
                <input
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                ></input>
                <button onClick={() => saveEdit(item.id)}>Зберегти</button>
                <button onClick={() => setEditingId(null)}>Скасувати</button>
              </div>
            ) : (
              <div>
                <h3>{item.name}</h3>
                <p>{item.category?.name}</p>
                <p>{item.wear}</p>
                <p>{item.price}</p>
                <button onClick={() => startEdit(item)}>Редагувати</button>
                <button onClick={() => deleteItem(item.id)}>Видалити</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default App;
