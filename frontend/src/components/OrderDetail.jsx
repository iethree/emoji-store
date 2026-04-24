import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../api.js';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder(id).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-detail" data-testid="order-detail">
      <h2>Order #{order.id}</h2>
      <p className="success" data-testid="thank-you">🎉 Thanks for your purchase!</p>
      <p>Status: {order.status}</p>
      <ul>
        {order.items.map((i) => (
          <li key={i.id}>
            {i.symbol} {i.name} × {i.quantity} — ${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="total">Total paid: <strong>${(order.total_cents / 100).toFixed(2)}</strong></p>
      <Link to="/">Continue shopping</Link>
    </div>
  );
}
