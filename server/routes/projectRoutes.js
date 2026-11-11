
import express from 'express'
import multer from 'multer'

import protect from '../middleware/authMiddleware.js'

import {
  saveProject,
  getProjects,
  getProjectById,
  getUsage,
  deleteProject,
} from '../controllers/projectController.js'

const router = express.Router()

// Image upload configuration
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 22 * 1024 * 1024,
    files: 2,
  },

  fileFilter(req, file, cb) {
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ]

    if (!acceptedTypes.includes(file.mimetype)) {
      return cb(
        new Error('Unsupported image format. Please upload PNG, JPEG, or WebP.')
      )
    }

    cb(null, true)
  },
})

// Validate uploaded project images
const validateProjectImages = (req, res, next) => {
  const originalImage = req.files?.originalImage?.[0]
  const processedImage = req.files?.processedImage?.[0]

  if (!originalImage || !processedImage) {
    return res.status(400).json({
      message: 'Both original and processed images are required.',
    })
  }

  next()
}

// Authentication must run before all project routes
router.use(protect)

// Save a project
router.post(
  '/',
  upload.fields([
    { name: 'originalImage', maxCount: 1 },
    { name: 'processedImage', maxCount: 1 },
  ]),
  validateProjectImages,
  saveProject
)

// Get all saved projects
router.get('/', getProjects)

// Get usage information
router.get('/usage', getUsage)

// Get one project by ID
router.get('/:id', getProjectById)

// Delete a project
router.delete('/:id', deleteProject)

export default router
