import express, { Request, Response, NextFunction, urlencoded } from "express"
import dotenv from "dotenv"
import Razorpay from "razorpay"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import prisma from "./utils/prisma"

// Import new modular routers
import authRouter from "./router/auth.router"
import courseRouter from "./router/course.router"
import paymentRouter from "./router/payment.router"
import purchaseRouter from "./router/purchase.router"
import userRouter from "./router/userRouter"

// Import new error handling middleware
import { globalErrorHandler } from "./middleware/errorHandler.middleware"

// Load environment variables at the very top
dotenv.config()

// --- Database Connection ---
async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

connectToDatabase();

// --- Razorpay Instance ---
if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    console.error("❌ Fatal Error: Razorpay Key or Secret is not defined in .env file");
    process.exit(1);
}

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middleware ---
// Security headers with helmet
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration with multiple origins support
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://skillyug.com',
  'https://www.skillyug.com',
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting with different tiers
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/api/test' || req.path === '/';
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit auth attempts to 10 per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts, please try again after 15 minutes',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
});

// Apply rate limiting
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(urlencoded({ extended: true }));

// Debug middleware for auth endpoints
app.use('/api/auth', (req: Request, res: Response, next: NextFunction) => {
    console.log(`🔍 Auth Request Debug:`, {
        method: req.method,
        url: req.url,
        body: req.body,
        headers: {
            'content-type': req.headers['content-type'],
            'origin': req.headers.origin,
            'user-agent': req.headers['user-agent']?.substring(0, 50)
        }
    });
    next();
});

// --- Health Check and Public Routes ---
app.get('/api/test', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: 'Backend API is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Backend is up and running!</h1>");
});

// Legacy endpoint for Razorpay key (kept for backward compatibility)
app.get('/api/getKey', (req: Request, res: Response) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY });
});

// --- API Routes ---
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/users", userRouter);

// --- 404 Handler for unmatched routes ---
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// --- Global Error Handling Middleware ---
app.use(globalErrorHandler);

// --- Server Startup ---
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});

// --- Graceful Shutdown ---
const gracefulShutdown = (signal: string) => {
    console.log(`\n🚨 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        console.log('✅ HTTP server closed.');
        try {
            await prisma.$disconnect();
            console.log('✅ Database connection closed.');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during database disconnection:', error);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;