const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchEmojis(category) {
  const url = category ? `${API}/api/emojis?category=${category}` : `${API}/api/emojis`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch emojis');
  return res.json();
}

export async function fetchCustomer(id) {
  const res = await fetch(`${API}/api/customers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch customer');
  return res.json();
}

export async function createCustomer(email, name) {
  const res = await fetch(`${API}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create customer');
  }
  return res.json();
}

export async function checkout(customer_id, items) {
  const res = await fetch(`${API}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id, items }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json();
}

export async function fetchOrders(customer_id) {
  const res = await fetch(`${API}/api/orders?customer_id=${customer_id}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrder(id) {
  const res = await fetch(`${API}/api/orders/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
}
