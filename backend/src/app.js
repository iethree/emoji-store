const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const { calculateTotal, applyBulkDiscount } = require('./pricing');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/emojis', async (req, res) => {
    try {
      const { category } = req.query;
      let result;
      if (category) {
        result = await pool.query(
          'SELECT * FROM emojis WHERE category = $1 ORDER BY id',
          [category]
        );
      } else {
        result = await pool.query('SELECT * FROM emojis ORDER BY id');
      }
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/emojis/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM emojis WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/customers/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/customers', async (req, res) => {
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        return res.status(400).json({ error: 'email and name required' });
      }
      const result = await pool.query(
        'INSERT INTO customers (email, name) VALUES ($1, $2) RETURNING *',
        [email, name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'email already exists' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/checkout', async (req, res) => {
    const client = await pool.connect();
    try {
      const { customer_id, items } = req.body;
      if (!customer_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'customer_id and items required' });
      }

      await client.query('BEGIN');

      const customerRes = await client.query(
        'SELECT * FROM customers WHERE id = $1 FOR UPDATE',
        [customer_id]
      );
      if (customerRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'customer not found' });
      }
      const customer = customerRes.rows[0];

      const enriched = [];
      for (const item of items) {
        const er = await client.query(
          'SELECT * FROM emojis WHERE id = $1 FOR UPDATE',
          [item.emoji_id]
        );
        if (er.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: `emoji ${item.emoji_id} not found` });
        }
        const emoji = er.rows[0];
        if (emoji.stock < item.quantity) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: `insufficient stock for ${emoji.name}` });
        }
        enriched.push({ ...emoji, quantity: item.quantity });
      }

      const subtotal = calculateTotal(enriched);
      const totalCount = enriched.reduce((a, b) => a + b.quantity, 0);
      const total = applyBulkDiscount(subtotal, totalCount);

      if (customer.monopoly_balance_cents < total) {
        await client.query('ROLLBACK');
        return res.status(402).json({ error: 'insufficient monopoly money' });
      }

      const orderRes = await client.query(
        'INSERT INTO orders (customer_id, total_cents) VALUES ($1, $2) RETURNING *',
        [customer_id, total]
      );
      const order = orderRes.rows[0];

      for (const it of enriched) {
        await client.query(
          'INSERT INTO order_items (order_id, emoji_id, quantity, unit_price_cents) VALUES ($1, $2, $3, $4)',
          [order.id, it.id, it.quantity, it.price_cents]
        );
        await client.query(
          'UPDATE emojis SET stock = stock - $1 WHERE id = $2',
          [it.quantity, it.id]
        );
      }

      await client.query(
        'UPDATE customers SET monopoly_balance_cents = monopoly_balance_cents - $1 WHERE id = $2',
        [total, customer_id]
      );

      await client.query('COMMIT');
      res.status(201).json({ order, total, subtotal });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const { customer_id } = req.query;
      let result;
      if (customer_id) {
        result = await pool.query(
          'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
          [customer_id]
        );
      } else {
        result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      }
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const o = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
      if (o.rows.length === 0) return res.status(404).json({ error: 'not found' });
      const items = await pool.query(
        `SELECT oi.*, e.symbol, e.name FROM order_items oi
         JOIN emojis e ON e.id = oi.emoji_id WHERE oi.order_id = $1`,
        [req.params.id]
      );
      res.json({ ...o.rows[0], items: items.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

module.exports = { createApp };
