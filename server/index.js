
import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { randomUUID } from 'node:crypto'

import connectDB from './config/db.js'
import cloudinary from './config/cloudinary.js'

import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import protect from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5000

// Trust the Vercel reverse proxy.
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

// Ensure MongoDB is connected before handling API requests.
// The connection helper caches the connection for serverless use.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('Database connection error:', error.message)

    return res.status(503).json({
      success: false,
      message: 'Database is temporarily unavailable. Please try again.',
    })
  }
})

// Root health check.
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Pixclear API is running!',
  })
})

// API health check.
app.get('/api/health', (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1

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

// Check that the supplied image URL belongs to the
// authenticated user's Cloudinary folder.
const validateCloudinaryImageUrl = (imageUrl, userId) => {
  if (
    typeof imageUrl !== 'string' ||
    imageUrl.length > 2048
  ) {
    return false
  }

  try {
    const imageUrlObject = new URL(imageUrl)

    if (
      imageUrlObject.protocol !== 'https:' ||
      imageUrlObject.hostname !== 'res.cloudinary.com'
    ) {
      return false
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      throw new Error('Cloudinary cloud name is not configured.')
    }

    const expectedPrefix = `/${cloudName}/image/upload/`

    if (!imageUrlObject.pathname.startsWith(expectedPrefix)) {
      return false
    }

    let assetPath = imageUrlObject.pathname.slice(
      expectedPrefix.length
    )

    // Remove Cloudinary's version segment, if present.
    assetPath = assetPath.replace(/^v\d+\//, '')

    assetPath = decodeURIComponent(assetPath)

    const expectedUserFolder = `pixclear/users/${userId}/`

    return assetPath.startsWith(expectedUserFolder)
  } catch (error) {
    if (error.message === 'Cloudinary cloud name is not configured.') {
      throw error
    }

    return false
  }
}

// Upload a processed image buffer to Cloudinary.
const uploadProcessedImage = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return reject(
        new Error('Invalid processed image buffer.')
      )
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `pixclear/users/${userId}`,
        public_id: `processed-${randomUUID()}`,
        resource_type: 'image',
        format: 'png',
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }

        if (!result?.secure_url || !result?.public_id) {
          return reject(
            new Error('Cloudinary returned incomplete image information.')
          )
        }

        resolve(result)
      }
    )

    uploadStream.on('error', reject)
    uploadStream.end(buffer)
  })
}

// Background removal.
app.post(
  '/api/remove-background',
  protect,
  async (req, res) => {
    try {
      if (!process.env.REMOVE_BG_API_KEY) {
        return res.status(500).json({
          success: false,
          message: 'Remove.bg API key is not configured.',
        })
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).json({
          success: false,
          message: 'Cloudinary is not properly configured.',
        })
      }

      const userId = req.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in again.',
        })
      }

      const { imageUrl } = req.body || {}

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'An image URL is required.',
        })
      }

      // Prevent arbitrary external URLs from being processed.
      const validImageUrl = validateCloudinaryImageUrl(
        imageUrl,
        userId
      )

      if (!validImageUrl) {
        return res.status(400).json({
          success: false,
          message: 'The supplied image URL is invalid.',
        })
      }

      // Prepare remove.bg request.
      const formData = new FormData()

      formData.append('image_url', imageUrl)
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
            'Background removal failed. Please check your API credits or try again.',
        })
      }

      // Receive the processed image from remove.bg.
      const imageBuffer = Buffer.from(
        await response.arrayBuffer()
      )

      if (!imageBuffer.length) {
        return res.status(502).json({
          success: false,
          message: 'Background removal returned an empty image.',
        })
      }

      // Store the processed result directly in Cloudinary.
      const processedUpload = await uploadProcessedImage(
        imageBuffer,
        userId
      )

      return res.status(200).json({
        success: true,
        message: 'Background removed successfully.',
        imageUrl: processedUpload.secure_url,
      })
    } catch (error) {
      console.error(
        'Background processing error:',
        error.message
      )

      if (
        error.name === 'TimeoutError' ||
        error.name === 'AbortError'
      ) {
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

  if (error.message?.startsWith('Origin not allowed by CORS:')) {
    statusCode = 403
    message = 'This origin is not allowed to access the API.'
  }

  return res.status(statusCode).json({
    success: false,
    message,
  })
})

// Export Express app for Vercel serverless deployment.
export default app

// Start a normal HTTP server during local development.
// Vercel handles the serverless listener itself.
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pixclear server running on port ${PORT}`)
  })
}
