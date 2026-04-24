import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { checkout, fetchCustomer, createCustomer } from '../api.js';

const CUSTOMER_KEY = 'emoji-customer-id';

export default function Checkout() {
  const { items, totalCents, clear } = useCart();
  const [customer, setCustomer] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem(CUSTOMER_KEY);
    if (id) {
      fetchCustomer(id)
        .then(setCustomer)
        .catch(() => localStorage.removeItem(CUSTOMER_KEY));
    }
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    try {
      const c = await createCustomer(email, name);
      localStorage.setItem(CUSTOMER_KEY, c.id);
      setCustomer(c);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePay() {
    setProcessing(true);
    setError(null);
    try {
      const payload = items.map((i) => ({ emoji_id: i.id, quantity: i.quantity }));
      const result = await checkout(customer.id, payload);
      clear();
      navigate(`/orders/${result.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout">
        <h2>Checkout</h2>
        <p data-testid="empty-checkout">Your cart is empty.</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="checkout">
        <h2>Checkout</h2>
        <p>Register to pay with monopoly money:</p>
        <form onSubmit={handleRegister} data-testid="register-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="register-email"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-testid="register-name"
          />
          <button type="submit" data-testid="register-submit">Register</button>
        </form>
        {error && <p className="error" data-testid="register-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="customer-info" data-testid="customer-info">
        <p>Welcome, <strong>{customer.name}</strong></p>
        <p>Balance: <span data-testid="balance">${(customer.monopoly_balance_cents / 100).toFixed(2)}</span> in monopoly money</p>
      </div>
      <ul data-testid="checkout-items">
        {items.map((i) => (
          <li key={i.id}>
            {i.symbol} {i.name} × {i.quantity} — ${((i.price_cents * i.quantity) / 100).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="total">Total: <strong data-testid="checkout-total">${(totalCents / 100).toFixed(2)}</strong></p>
      <button
        onClick={handlePay}
        disabled={processing}
        className="pay-btn"
        data-testid="pay-btn"
      >
        {processing ? 'Processing...' : 'Pay with Monopoly Money'}
      </button>
      {error && <p className="error" data-testid="checkout-error">{error}</p>}
    </div>
  );
}
