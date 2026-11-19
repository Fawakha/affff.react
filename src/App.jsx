import { useState, useEffect } from 'react'; 
import './App.css'; 
function App() { 
  const [items, setItems] = useState([])

 useEffect (() => { 
  fetch('http://localhost:5284/inventory/All')
  .then(response => response.json())
  .then(data => setItems(data))
  .catch(error => console.error('Помилка', error)); 
 }, []); 

 return ( 
  <div> 
    <h1>Арсенал </h1>
    <div className='inventory-container'> 
      {items.map(items => ( 
        <div key = {items.id} className="card"> 
        <h3>{items.name}</h3>
        <p>{items.category?.name || 'Без категорії'}</p>
        <p>{items.wear}</p>
        <p>{items.price}</p>
      </div>
      ))}
    </div> 
  </div> 
 );
}
export default App;
