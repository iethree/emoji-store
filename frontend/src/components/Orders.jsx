import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../api.js';

const CUSTOMER_KEY = 'emoji-customer-id';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem(CUSTOMER_KEY);
    if (!id) {
      setLoading(false);
      return;
    }
    fetchOrders(id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (orders.length === 0) {
    return (
      <div className="orders">
        <h2>Your Orders</h2>
        <p data-testid="no-orders">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      <ul data-testid="orders-list">
        {orders.map((o) => (
          <li key={o.id} data-testid={`order-${o.id}`}>
            <Link to={`/orders/${o.id}`}>
              Order #{o.id} — ${(o.total_cents / 100).toFixed(2)} — {o.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
