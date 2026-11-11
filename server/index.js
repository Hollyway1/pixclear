
import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import protect from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5000

// Trust Render's reverse proxy.
app.set('trust proxy', 1)

// Allowed frontend origins.
const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]
    .filter(Boolean)
    .map((origin) => origin.trim().replace(/\/+$/, ''))
)

// Security middleware.
app.use(helmet())

// CORS configuration.
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as server-to-server requests.
      if (!origin) {
        return callback(null, true)
      }

      const normalizedOrigin = origin.replace(/\/+$/, '')

      if (allowedOrigins.has(normalizedOrigin)) {
        return callback(null, true)
      }

      return callback(
        new Error(`Origin not allowed by CORS: ${origin}`)
      )
    },
    credentials: true,
  })
)

// Request parsing.
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// General API rate limiter.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})

app.use('/api/', limiter)

// Image upload configuration.
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 22 * 1024 * 1024,
    files: 1,
  },

  fileFilter(req, file, callback) {
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ]

    if (!acceptedTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          'Please upload a PNG, JPG, JPEG or WebP image.'
        )
      )
    }

    callback(null, true)
  },
})

// Root health check.
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pixclear API is running!',
  })
})

// API health check.
app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1

  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? 'Pixclear API and database are healthy.'
      : 'Pixclear API is running, but the database is unavailable.',
    database: databaseConnected ? 'connected' : 'disconnected',
  })
})

// Authentication routes.
app.use('/api/auth', authRoutes)

// Project management routes.
app.use('/api/projects', projectRoutes)

// Background removal.
app.post(
  '/api/remove-background',
  protect,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!process.env.REMOVE_BG_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Remove.bg API key is not configured.',
        })
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image.',
        })
      }

      const formData = new FormData()

      formData.append(
        'image_file',
        new Blob([req.file.buffer], {
          type: req.file.mimetype,
        }),
        req.file.originalname || 'upload'
      )

      formData.append('size', 'auto')

      const response = await fetch(
        'https://api.remove.bg/v1.0/removebg',
        {
          method: 'POST',
          headers: {
            'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          },
          body: formData,
          signal: AbortSignal.timeout(60000),
        }
      )

      if (!response.ok) {
        const errorDetails = await response.text()

        console.error(
          'remove.bg request failed:',
          response.status,
          errorDetails
        )

        return res.status(502).json({
          success: false,
          message:
            'Background removal failed. Please check your API key, API credits, or try again.',
        })
      }

      const imageBuffer = Buffer.from(
        await response.arrayBuffer()
      )

      if (!imageBuffer.length) {
        return res.status(502).json({
          success: false,
          message: 'Background removal returned an empty image.',
        })
      }

      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition':
          'inline; filename="pixclear-result.png"',
        'Cache-Control': 'no-store',
      })

      return res.send(imageBuffer)
    } catch (error) {
      console.error('Background processing error:', error.message)

      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        return res.status(504).json({
          success: false,
          message: 'Image processing timed out. Please try again.',
        })
      }

      return res.status(502).json({
        success: false,
        message:
          'An error occurred while processing your image. Please try again.',
      })
    }
  }
)

// Handle unknown routes.
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// Central error handling middleware.
app.use((error, req, res, next) => {
  console.error('Server error:', error.message)

  if (res.headersSent) {
    return next(error)
  }

  let statusCode = 500
  let message = 'Something went wrong on the server.'

  if (error instanceof multer.MulterError) {
    statusCode = 400

    if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'Image size must not exceed 22MB.'
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      message = 'Only one image can be uploaded at a time.'
    } else {
      message = error.message
    }
  } else if (
    error.message?.startsWith('Please upload')
  ) {
    statusCode = 400
    message = error.message
  } else if (
    error.message?.startsWith('Origin not allowed by CORS:')
  ) {
    statusCode = 403
    message = 'This origin is not allowed to access the API.'
  }

  return res.status(statusCode).json({
    success: false,
    message,
  })
})

// Start server only after successful database connection.
const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Pixclear server running on port ${PORT}`)
      console.log('MongoDB connection established.')
    })
  } catch (error) {
    console.error(
      'Unable to start Pixclear:',
      error.message
    )

    process.exit(1)
  }
}

startServer()
