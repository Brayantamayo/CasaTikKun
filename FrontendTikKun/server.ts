import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * In-memory store on the server side (ready to be replaced by PostgreSQL / Cloud SQL / Firestore).
 * Provides full REST API endpoints for Cabins, Reviews (FIFO max 10), Landing Media, and Booking Leads.
 */
const serverStore = {
  cabins: [] as Record<string, unknown>[],
  reviews: [] as Record<string, unknown>[],
  media: {
    heroImages: [] as string[],
    galleryImages: [] as string[],
    updatedAt: new Date().toISOString()
  },
  bookings: [] as Record<string, unknown>[]
};

const MAX_REVIEWS = 10;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support larger payloads for base64 encoded cabin/gallery photos
  app.use(express.json({ limit: '15mb' }));

  // --- 1. HEALTH CHECK ---
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        service: 'Casa Tikkun Backend API',
        environment: process.env.NODE_ENV || 'development'
      },
      timestamp: new Date().toISOString()
    });
  });

  // --- 2. CABINS CRUD ENDPOINTS ---
  app.get('/api/cabins', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: serverStore.cabins,
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/cabins', (req: Request, res: Response) => {
    const cabin = req.body;
    if (!cabin || !cabin.id || !cabin.name) {
      res.status(400).json({
        success: false,
        error: 'Datos de cabaña incompletos (id y name son obligatorios).',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const existingIdx = serverStore.cabins.findIndex((c) => c.id === cabin.id);
    if (existingIdx >= 0) {
      serverStore.cabins[existingIdx] = { ...serverStore.cabins[existingIdx], ...cabin };
    } else {
      serverStore.cabins.push(cabin);
    }

    res.status(201).json({
      success: true,
      data: cabin,
      timestamp: new Date().toISOString()
    });
  });

  app.put('/api/cabins', (req: Request, res: Response) => {
    const cabin = req.body;
    if (!cabin || !cabin.id) {
      res.status(400).json({
        success: false,
        error: 'ID de cabaña requerido para actualizar.',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const existingIdx = serverStore.cabins.findIndex((c) => c.id === cabin.id);
    if (existingIdx >= 0) {
      serverStore.cabins[existingIdx] = { ...serverStore.cabins[existingIdx], ...cabin };
    } else {
      serverStore.cabins.push(cabin);
    }

    res.json({
      success: true,
      data: cabin,
      timestamp: new Date().toISOString()
    });
  });

  app.delete('/api/cabins/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    serverStore.cabins = serverStore.cabins.filter((c) => c.id !== id);
    res.json({
      success: true,
      data: { deletedId: id },
      timestamp: new Date().toISOString()
    });
  });

  // --- 3. REVIEWS ENDPOINTS (MAX 10 FIFO QUEUE) ---
  app.get('/api/reviews', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: serverStore.reviews.slice(0, MAX_REVIEWS),
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const review = req.body;
    if (!review || !review.guestName || !review.comment) {
      res.status(400).json({
        success: false,
        error: 'Nombre del huésped y comentario son requeridos.',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const newReview = {
      id: review.id || `rev-${Date.now()}`,
      guestName: String(review.guestName).trim(),
      guestCity: String(review.guestCity || 'Medellín, Colombia').trim(),
      rating: Number(review.rating) || 5,
      date: review.date || 'Hace un momento',
      accommodationId: review.accommodationId,
      accommodationName: review.accommodationName || 'Cabaña Casa Tikkun',
      comment: String(review.comment).trim(),
      travelType: review.travelType || 'En Pareja',
      verifiedBooking: true
    };

    // Enforce max 10 reviews FIFO
    serverStore.reviews = [newReview, ...serverStore.reviews].slice(0, MAX_REVIEWS);

    res.status(201).json({
      success: true,
      data: newReview,
      timestamp: new Date().toISOString()
    });
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    serverStore.reviews = serverStore.reviews.filter((r) => r.id !== id);
    res.json({
      success: true,
      data: { deletedId: id },
      timestamp: new Date().toISOString()
    });
  });

  // --- 4. LANDING & GALLERY MEDIA ENDPOINTS ---
  app.get('/api/media', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: serverStore.media,
      timestamp: new Date().toISOString()
    });
  });

  app.put('/api/media', (req: Request, res: Response) => {
    const { heroImages, galleryImages } = req.body || {};
    if (Array.isArray(heroImages)) {
      serverStore.media.heroImages = heroImages;
    }
    if (Array.isArray(galleryImages)) {
      serverStore.media.galleryImages = galleryImages;
    }
    serverStore.media.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: serverStore.media,
      timestamp: new Date().toISOString()
    });
  });

  // --- 5. WHATSAPP BOOKING INQUIRIES ENDPOINTS ---
  app.get('/api/bookings', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: serverStore.bookings,
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const booking = req.body;
    const record = {
      ...booking,
      id: booking?.id || `inq-${Date.now()}`,
      createdAt: booking?.createdAt || new Date().toISOString()
    };
    serverStore.bookings = [record, ...serverStore.bookings].slice(0, 100);

    res.status(201).json({
      success: true,
      data: record,
      timestamp: new Date().toISOString()
    });
  });

  // --- 6. VITE MIDDLEWARE OR STATIC PROD ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Casa Tikkun Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
