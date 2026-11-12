
import express from 'express'
import { randomUUID } from 'node:crypto'

import protect from '../middleware/authMiddleware.js'
import cloudinary from '../config/cloudinary.js'

import {
  saveProject,
  getProjects,
  getProjectById,
  getUsage,
  deleteProject,
} from '../controllers/projectController.js'

const router = express.Router()

// Authenticate every project route.
router.use(protect)

// Generate a signed Cloudinary upload.
router.post('/upload-signature', (req, res) => {
  try {
    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
    } = process.env

    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not properly configured.',
      })
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const timestamp = Math.floor(Date.now() / 1000)

    // Generate the folder and public ID on the server.
   const folder = `pixclear/users/${req.userId}`
const publicId = randomUUID()

const uploadParams = {
  timestamp,
  folder,
  public_id: publicId,
}
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      CLOUDINARY_API_SECRET
    )

    return res.status(200).json({
      success: true,
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      timestamp,
      folder,
      publicId,
      signature,
    })
  } catch (error) {
    console.error(
      'Cloudinary signature error:',
      error.message
    )

    return res.status(500).json({
      success: false,
      message: 'Unable to prepare image upload.',
    })
  }
})

// Save a project using verified Cloudinary image information.
router.post('/', saveProject)

// Get all saved projects.
router.get('/', getProjects)

// Get monthly usage.
router.get('/usage', getUsage)

// Get a saved project by ID.
router.get('/:id', getProjectById)

// Delete a saved project.
router.delete('/:id', deleteProject)

export default router
