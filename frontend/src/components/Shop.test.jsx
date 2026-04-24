import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../CartContext.jsx';
import Shop from './Shop.jsx';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, symbol: '😀', name: 'Grinning', price_cents: 199, stock: 10, category: 'faces' },
        ]),
    })
  );
});

test('renders emoji grid', async () => {
  render(
    <MemoryRouter>
      <CartProvider>
        <Shop />
      </CartProvider>
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText('Grinning')).toBeInTheDocument());
  expect(screen.getByText('😀')).toBeInTheDocument();
});
