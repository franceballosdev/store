import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database(join(__dirname, 'store.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    rating REAL DEFAULT 5,
    stock INTEGER DEFAULT 100,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    session_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS page_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const seedProducts = [
    { name: 'Auriculares Premium', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electrónica', description: 'Auriculares inalámbricos con cancelación de ruido', rating: 4.8, featured: 1 },
    { name: 'Reloj Inteligente', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Electrónica', description: 'Smartwatch con monitoreo de salud', rating: 4.6, featured: 1 },
    { name: 'Zapatillas Deportivas', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Ropa', description: 'Calzado deportivo de alta performance', rating: 4.7, featured: 1 },
    { name: 'Mochila Urbana', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'Accesorios', description: 'Mochila resistente al agua con compartimento laptop', rating: 4.5, featured: 1 },
    { name: 'Cámara Vintage', price: 449.99, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', category: 'Electrónica', description: 'Cámara retro con lentes intercambiables', rating: 4.9, featured: 0 },
    { name: 'Gafas de Sol', price: 159.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'Accesorios', description: 'Gafas UV400 con montura de titanio', rating: 4.4, featured: 0 },
    { name: 'Botella Térmica', price: 34.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'Hogar', description: 'Botella de acero inoxidable 24h frío/calor', rating: 4.7, featured: 0 },
    { name: 'Lámpara Minimalista', price: 79.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', category: 'Hogar', description: 'Lámpara LED regulable con control táctil', rating: 4.6, featured: 0 },
  ];

  const insert = db.prepare(`
    INSERT INTO products (name, price, image, category, description, rating, featured)
    VALUES (@name, @price, @image, @category, @description, @rating, @featured)
  `);

  seedProducts.forEach(product => insert.run(product));
  console.log('Database seeded with products');
}

// ===== AUTH MIDDLEWARE =====

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ===== AUTH ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run(name, email, hashedPassword, 'customer');

  const token = jwt.sign(
    { userId: result.lastInsertRowid, email, role: 'customer' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: result.lastInsertRowid, name, email, role: 'customer' }
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Setup default admin (solo para desarrollo)
app.post('/api/admin/setup', async (req, res) => {
  const adminEmail = 'admin@store.com';
  
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (existingAdmin) {
    return res.status(409).json({ 
      error: 'Admin already exists',
      credentials: { email: adminEmail, password: 'admin123' }
    });
  }

  const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  
  const result = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run('Administrador', adminEmail, hashedPassword, 'admin');

  res.status(201).json({
    message: 'Admin user created successfully',
    credentials: {
      email: adminEmail,
      password: 'admin123'
    }
  });
});

// ===== PRODUCTS ROUTES =====

// Get all products
app.get('/api/products', (req, res) => {
  const { category, featured } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true') {
    query += ' AND featured = 1';
  }

  query += ' ORDER BY created_at DESC';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Create product (admin)
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, price, image, category, description, rating, stock, featured } = req.body;
  const result = db.prepare(`
    INSERT INTO products (name, price, image, category, description, rating, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, price, image, category, description, rating || 5, stock || 100, featured ? 1 : 0);
  
  res.status(201).json({ id: result.lastInsertRowid, ...req.body });
});

// Update product (admin)
app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, price, image, category, description, rating, stock, featured } = req.body;
  const result = db.prepare(`
    UPDATE products 
    SET name = ?, price = ?, image = ?, category = ?, description = ?, rating = ?, stock = ?, featured = ?
    WHERE id = ?
  `).run(name, price, image, category, description, rating || 5, stock || 100, featured ? 1 : 0, req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ id: req.params.id, ...req.body });
});

// Delete product (admin)
app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ message: 'Product deleted successfully' });
});

// ===== CART ROUTES =====

// Get cart items
app.get('/api/cart', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  const items = db.prepare(`
    SELECT ci.*, p.name, p.price, p.image, p.category
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.session_id = ?
  `).all(sessionId);
  res.json(items);
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';

  const existing = db.prepare('SELECT * FROM cart_items WHERE product_id = ? AND session_id = ?')
    .get(productId, sessionId);

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?')
      .run(quantity, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (product_id, quantity, session_id) VALUES (?, ?, ?)')
      .run(productId, quantity, sessionId);
  }

  res.status(201).json({ message: 'Added to cart' });
});

// Update cart quantity
app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';

  if (quantity <= 0) {
    db.prepare('DELETE FROM cart_items WHERE id = ? AND session_id = ?').run(req.params.id, sessionId);
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND session_id = ?')
      .run(quantity, req.params.id, sessionId);
  }

  res.json({ message: 'Cart updated' });
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  db.prepare('DELETE FROM cart_items WHERE id = ? AND session_id = ?').run(req.params.id, sessionId);
  res.json({ message: 'Removed from cart' });
});

// Clear cart
app.delete('/api/cart', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
  res.json({ message: 'Cart cleared' });
});

// ===== ORDERS ROUTES =====

// Create order
app.post('/api/orders', (req, res) => {
  const { customerName, email, phone, address, items, total } = req.body;
  const sessionId = req.headers['x-session-id'] || 'default';

  const orderResult = db.prepare(`
    INSERT INTO orders (customer_name, email, phone, address, total)
    VALUES (?, ?, ?, ?, ?)
  `).run(customerName, email, phone || '', address, total);

  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

  items.forEach(item => {
    insertItem.run(orderId, item.product_id, item.quantity, item.price);
  });

  // Clear cart after order
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);

  res.status(201).json({ orderId, message: 'Order created successfully' });
});

// Get orders
app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  
  const ordersWithItems = orders.map(order => {
    const items = db.prepare(`
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
    return { ...order, items };
  });

  res.json(ordersWithItems);
});

// Update order status (admin)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Order status updated', status });
});

// Delete order (admin)
app.delete('/api/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  // First delete order items
  db.prepare('DELETE FROM order_items WHERE order_id = ?').run(req.params.id);
  
  // Then delete order
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Order deleted successfully' });
});

// ===== ADMIN STATS ROUTES =====

// Get dashboard stats (admin)
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  // Total sales
  const sales = db.prepare(`
    SELECT 
      COUNT(*) as total_orders,
      COALESCE(SUM(total), 0) as total_revenue,
      COALESCE(SUM(CASE WHEN status != 'cancelled' AND status != 'refunded' THEN total ELSE 0 END), 0) as net_revenue
    FROM orders
  `).get();

  // Active users (registered users)
  const users = db.prepare(`
    SELECT COUNT(*) as total_users
    FROM users
    WHERE role = 'customer'
  `).get();

  // Top selling products
  const topProducts = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.image,
      SUM(oi.quantity) as total_sold,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled' AND o.status != 'refunded'
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 5
  `).all();

  // Sales by day (last 30 days)
  const salesByDay = db.prepare(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as orders,
      COALESCE(SUM(total), 0) as revenue
    FROM orders
    WHERE created_at >= DATE('now', '-30 days')
    AND status != 'cancelled' AND status != 'refunded'
    GROUP BY DATE(created_at)
    ORDER BY date
  `).all();

  // Recent orders
  const recentOrders = db.prepare(`
    SELECT * FROM orders
    ORDER BY created_at DESC
    LIMIT 5
  `).all();

  res.json({
    sales,
    users,
    topProducts,
    salesByDay,
    recentOrders
  });
});

// ===== PAGE CONTENT ROUTES =====

// Get page content by slug
app.get('/api/pages/:slug', (req, res) => {
  const page = db.prepare('SELECT * FROM page_content WHERE slug = ?').get(req.params.slug);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  res.json(page);
});

// Get all pages
app.get('/api/pages', (req, res) => {
  const pages = db.prepare('SELECT id, slug, title, updated_at FROM page_content ORDER BY slug').all();
  res.json(pages);
});

// Create/update page content (admin)
app.put('/api/pages/:slug', authenticateToken, requireAdmin, (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const existing = db.prepare('SELECT * FROM page_content WHERE slug = ?').get(req.params.slug);
  
  if (existing) {
    db.prepare(`
      UPDATE page_content SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(title, content, req.params.slug);
    res.json({ message: 'Page updated successfully', slug: req.params.slug });
  } else {
    const result = db.prepare(`
      INSERT INTO page_content (slug, title, content)
      VALUES (?, ?, ?)
    `).run(req.params.slug, title, content);
    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Page created successfully',
      slug: req.params.slug 
    });
  }
});

// Delete page content (admin)
app.delete('/api/pages/:slug', authenticateToken, requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM page_content WHERE slug = ?').run(req.params.slug);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Page not found' });
  }

  res.json({ message: 'Page deleted successfully' });
});

// Get user's wishlist
app.get('/api/wishlist', authenticateToken, (req, res) => {
  const items = db.prepare(`
    SELECT w.*, p.name, p.price, p.image, p.category, p.rating
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).all(req.userId);
  res.json(items);
});

// Add to wishlist
app.post('/api/wishlist', authenticateToken, (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    db.prepare(`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (?, ?)
    `).run(req.userId, productId);
    
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }
    throw err;
  }
});

// Remove from wishlist
app.delete('/api/wishlist/:productId', authenticateToken, (req, res) => {
  const result = db.prepare(`
    DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
  `).run(req.userId, req.params.productId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found in wishlist' });
  }

  res.json({ message: 'Removed from wishlist' });
});

// Check if product is in wishlist
app.get('/api/wishlist/check/:productId', authenticateToken, (req, res) => {
  const item = db.prepare(`
    SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?
  `).get(req.userId, req.params.productId);

  res.json({ isInWishlist: !!item });
});

// ===== REVIEWS ROUTES =====

// Get reviews for a product
app.get('/api/products/:id/reviews', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.id);

  // Calculate average rating
  const stats = db.prepare(`
    SELECT 
      AVG(rating) as average_rating,
      COUNT(*) as total_reviews,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM reviews
    WHERE product_id = ?
  `).get(req.params.id);

  res.json({ reviews, stats });
});

// Add a review (requires authentication)
app.post('/api/products/:id/reviews', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  // Check if product exists
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check if user already reviewed this product
  const existingReview = db.prepare(`
    SELECT * FROM reviews WHERE user_id = ? AND product_id = ?
  `).get(req.userId, productId);

  if (existingReview) {
    // Update existing review
    db.prepare(`
      UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND product_id = ?
    `).run(rating, comment, req.userId, productId);
    
    res.json({ message: 'Review updated' });
  } else {
    // Create new review
    const result = db.prepare(`
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(req.userId, productId, rating, comment);
    
    res.status(201).json({ 
      id: result.lastInsertRowid,
      user_id: req.userId,
      product_id: productId,
      rating,
      comment,
      created_at: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
