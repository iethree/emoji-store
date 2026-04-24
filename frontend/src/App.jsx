import { Routes, Route, Link } from 'react-router-dom';
import Shop from './components/Shop.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Orders from './components/Orders.jsx';
import OrderDetail from './components/OrderDetail.jsx';
import { useCart } from './CartContext.jsx';

export default function App() {
  const { itemCount } = useCart();
  return (
    <div className="app">
      <header>
        <h1><Link to="/">🛍️ Emoji Store</Link></h1>
        <nav>
          <Link to="/">Shop</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart" data-testid="cart-link">
            Cart <span className="cart-badge" data-testid="cart-count">{itemCount}</span>
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </main>
      <footer>Pay with monopoly money. Demo only.</footer>
    </div>
  );
}
