
import mongoose from 'mongoose'

import Project from '../models/Project.js'
import cloudinary from '../config/cloudinary.js'

// Get the authenticated user's ID.
// Supports common authentication middleware formats.
const getAuthenticatedUserId = (req) => {
  if (req.userId) {
    return req.userId
  }

  if (typeof req.user === 'string') {
    return req.user
  }

  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId ||
    null
  )
}

// Get the beginning and end of the current month.
const getCurrentMonthRange = () => {
  const now = new Date()

  return {
    monthStart: new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ),

    nextMonth: new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    ),
  }
}

// Get the free monthly project limit.
const getMonthlyLimit = () => {
  const limit = Number(
    process.env.FREE_MONTHLY_LIMIT || 20
  )

  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error(
      'FREE_MONTHLY_LIMIT must be a valid non-negative integer.'
    )
  }

  return limit
}

// Count projects saved by a user this month.
const getMonthlyProjectCount = async (userId) => {
  const { monthStart, nextMonth } = getCurrentMonthRange()

  return Project.countDocuments({
    user: userId,

    createdAt: {
      $gte: monthStart,
      $lt: nextMonth,
    },
  })
}

// Upload an image buffer to Cloudinary.
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(
        new Error('Invalid image buffer.')
      )
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'pixclear/projects',
        resource_type: 'image',
        allowed_formats: ['png', 'jpg', 'jpeg', 'webp'],
        timeout: 120000,
      },

      (error, result) => {
        if (error) {
          return reject(error)
        }

        if (!result) {
          return reject(
            new Error('Cloudinary returned no upload result.')
          )
        }

        resolve(result)
      }
    )

    uploadStream.on('error', reject)

    uploadStream.end(buffer)
  })
}

// Delete an image from Cloudinary.
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return

  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error(
      'Cloudinary deletion error:',
      error.message
    )
  }
}

// SAVE PROJECT
export const saveProject = async (req, res) => {
  let originalUpload
  let processedUpload

  try {
    const userId = getAuthenticatedUserId(req)

    console.log('PROJECT: Authenticated user ID:', userId)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in again.',
      })
    }

    // Verify uploaded files.
    const originalFile = req.files?.originalImage?.[0]
    const processedFile = req.files?.processedImage?.[0]

    if (!originalFile || !processedFile) {
      return res.status(400).json({
        success: false,
        message: 'Both original and processed images are required.',
      })
    }

    // Validate image formats.
    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ]

    if (
      !validTypes.includes(originalFile.mimetype) ||
      !validTypes.includes(processedFile.mimetype)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported image format.',
      })
    }

    // Check monthly project allowance.
    const limit = getMonthlyLimit()

    const used = await getMonthlyProjectCount(userId)

    if (used >= limit) {
      return res.status(403).json({
        success: false,
        code: 'MONTHLY_LIMIT_REACHED',
        message: `You have reached your monthly limit of ${limit} saved projects. Your allowance will reset at the beginning of next month.`,
        usage: {
          used,
          limit,
          remaining: 0,
        },
      })
    }

    console.log(
      'Original image size:',
      (originalFile.size / (1024 * 1024)).toFixed(2),
      'MB'
    )

    console.log(
      'Processed image size:',
      (processedFile.size / (1024 * 1024)).toFixed(2),
      'MB'
    )

    // Upload original image.
    console.log('Uploading original image to Cloudinary...')

    originalUpload = await uploadToCloudinary(
      originalFile.buffer
    )

    console.log('Original image uploaded successfully.')

    // Upload processed image.
    console.log('Uploading processed image to Cloudinary...')

    processedUpload = await uploadToCloudinary(
      processedFile.buffer
    )

    console.log('Processed image uploaded successfully.')

    // Verify Cloudinary upload results.
    if (
      !originalUpload.secure_url ||
      !originalUpload.public_id ||
      !processedUpload.secure_url ||
      !processedUpload.public_id
    ) {
      throw new Error(
        'Cloudinary image information is incomplete.'
      )
    }

    // Save project information in MongoDB.
    console.log('Creating MongoDB project...')

    const project = await Project.create({
      user: userId,

      name:
        req.body.name?.trim().slice(0, 150) ||
        'Untitled Project',

      originalImage: {
        url: originalUpload.secure_url,
        publicId: originalUpload.public_id,
      },

      processedImage: {
        url: processedUpload.secure_url,
        publicId: processedUpload.public_id,
      },

      processingType: 'background-removal',
      status: 'completed',
    })

    console.log('Project saved successfully.')

    return res.status(201).json({
      success: true,
      message: 'Project saved successfully.',
      project,

      usage: {
        used: used + 1,
        limit,
        remaining: Math.max(0, limit - (used + 1)),
      },
    })

  } catch (error) {
    console.error('Save project error:', {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
    })

    // Clean up uploaded images if project saving fails.
    await Promise.all([
      deleteCloudinaryImage(originalUpload?.public_id),
      deleteCloudinaryImage(processedUpload?.public_id),
    ])

    return res.status(500).json({
      success: false,
      message: 'Unable to save project. Please try again.',
    })
  }
}

// GET ALL USER PROJECTS
export const getProjects = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const projects = await Project.find({
      user: userId,
    }).sort({
      createdAt: -1,
    })

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    })

  } catch (error) {
    console.error('Get projects error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve projects.',
    })
  }
}

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      })
    }

    const project = await Project.findOne({
      _id: id,
      user: userId,
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      })
    }

    return res.status(200).json({
      success: true,
      project,
    })

  } catch (error) {
    console.error('Get single project error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve project.',
    })
  }
}

// GET MONTHLY SAVED-PROJECT USAGE
export const getUsage = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const limit = getMonthlyLimit()

    const used = await getMonthlyProjectCount(userId)

    return res.status(200).json({
      success: true,
      used,
      limit,
      remaining: Math.max(0, limit - used),
      plan: 'free',
    })

  } catch (error) {
    console.error('Get usage error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve usage information.',
    })
  }
}

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      })
    }

    const project = await Project.findOne({
      _id: id,
      user: userId,
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      })
    }

    // Delete project from MongoDB.
    await project.deleteOne()

    // Delete associated images from Cloudinary.
    await Promise.all([
      deleteCloudinaryImage(
        project.originalImage?.publicId
      ),

      deleteCloudinaryImage(
        project.processedImage?.publicId
      ),
    ])

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    })

  } catch (error) {
    console.error('Delete project error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete project.',
    })
  }
}
