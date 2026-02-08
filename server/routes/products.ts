import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/products - Get all products (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Create product (protected)
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.create({ name, description, price, category });
    res.status(201).json(product);
  } catch (error: unknown) {
    const err = error as Error & { errors?: Record<string, { message: string }> };
    if (err.name === 'ValidationError' && err.errors) {
      const messages = Object.values(err.errors).map((e) => e.message);
      res.status(400).json({ error: messages.join(', ') });
      return;
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id - Update product (protected)
router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true, runValidators: true }
    );
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: unknown) {
    const err = error as Error & { errors?: Record<string, { message: string }> };
    if (err.name === 'ValidationError' && err.errors) {
      const messages = Object.values(err.errors).map((e) => e.message);
      res.status(400).json({ error: messages.join(', ') });
      return;
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id - Delete product (protected)
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router;
