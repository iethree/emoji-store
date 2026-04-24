import { useEffect, useState } from 'react';
import { fetchEmojis } from '../api.js';
import { useCart } from '../CartContext.jsx';

const CATEGORIES = ['all', 'faces', 'party', 'food', 'animals', 'travel', 'misc'];

export default function Shop() {
  const [emojis, setEmojis] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchEmojis(category === 'all' ? null : category)
      .then((data) => {
        setEmojis(data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="shop">
      <h2>Browse Emojis</h2>
      <div className="categories" data-testid="categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? 'active' : ''}
            data-testid={`category-${c}`}
          >
            {c}
          </button>
        ))}
      </div>
      {loading && <p data-testid="loading">Loading...</p>}
      {error && <p className="error" data-testid="error">{error}</p>}
      <div className="emoji-grid" data-testid="emoji-grid">
        {emojis.map((e) => (
          <div key={e.id} className="emoji-card" data-testid={`emoji-${e.id}`}>
            <div className="symbol">{e.symbol}</div>
            <div className="name">{e.name}</div>
            <div className="price">${(e.price_cents / 100).toFixed(2)}</div>
            <div className="stock">{e.stock} in stock</div>
            <button
              onClick={() => addItem(e)}
              disabled={e.stock === 0}
              data-testid={`add-${e.id}`}
            >
              {e.stock === 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
