import { Link } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalCents, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p data-testid="empty-cart">Your cart is empty.</p>
        <Link to="/">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <table data-testid="cart-table">
        <thead>
          <tr>
            <th>Emoji</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} data-testid={`cart-row-${i.id}`}>
              <td className="symbol">{i.symbol}</td>
              <td>{i.name}</td>
              <td>${(i.price_cents / 100).toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={i.quantity}
                  onChange={(e) => updateQuantity(i.id, Number(e.target.value))}
                  data-testid={`qty-${i.id}`}
                />
              </td>
              <td>${((i.price_cents * i.quantity) / 100).toFixed(2)}</td>
              <td>
                <button onClick={() => removeItem(i.id)} data-testid={`remove-${i.id}`}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="summary">
        <p>Items: <span data-testid="summary-count">{itemCount}</span></p>
        <p>Total: <span data-testid="summary-total">${(totalCents / 100).toFixed(2)}</span></p>
        {itemCount >= 5 && <p className="discount" data-testid="discount-note">Bulk discount applies at checkout!</p>}
        <Link to="/checkout" className="checkout-btn" data-testid="checkout-btn">Checkout</Link>
      </div>
    </div>
  );
}
