
import mongoose from 'mongoose'

import Project from '../models/Project.js'
import cloudinary from '../config/cloudinary.js'

// Get the authenticated user's ID.
const getAuthenticatedUserId = (req) => {
  return (
    req.userId ||
    req.user?._id ||
    req.user?.id ||
    req.user?.userId ||
    (typeof req.user === 'string' ? req.user : null)
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

// Verify that an image came from Cloudinary
// and belongs to the authenticated user's folder.
const verifyCloudinaryImage = (image, userId) => {
  if (!image || typeof image !== 'object') {
    return false
  }

  const {
    secure_url,
    public_id,
    version,
    signature,
  } = image

  if (
    typeof secure_url !== 'string' ||
    typeof public_id !== 'string' ||
    !public_id.trim() ||
    !version ||
    !signature ||
    typeof signature !== 'string'
  ) {
    return false
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiSecret) {
    throw new Error(
      'Cloudinary credentials are not configured.'
    )
  }

  // Ensure the image belongs to this user's folder.
  const expectedFolder = `pixclear/users/${userId}/`

  if (!public_id.startsWith(expectedFolder)) {
    return false
  }

  // Ensure the image URL belongs to this Cloudinary account
  // and corresponds to the supplied public ID and version.
  try {
    const imageUrl = new URL(secure_url)

    if (
      imageUrl.protocol !== 'https:' ||
      imageUrl.hostname !== 'res.cloudinary.com'
    ) {
      return false
    }

    const expectedPathPrefix =
      `/${cloudName}/image/upload/v${version}/${public_id}.`

    const decodedPath = decodeURIComponent(
      imageUrl.pathname
    )

    if (!decodedPath.startsWith(expectedPathPrefix)) {
      return false
    }
  } catch {
    return false
  }

  // Verify Cloudinary's upload response signature.
  try {
    return cloudinary.utils.verify_api_response_signature(
      public_id,
      version,
      signature
    )
  } catch (error) {
    console.error(
      'Cloudinary signature verification error:',
      error.message
    )

    return false
  }
}

// Delete an image from Cloudinary.
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    })
  } catch (error) {
    console.error(
      'Cloudinary deletion error:',
      error.message
    )
  }
}

// SAVE PROJECT
export const saveProject = async (req, res) => {
  let originalPublicId
  let processedPublicId

  try {
    const userId = getAuthenticatedUserId(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login again.',
      })
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: 'Your user session is invalid.',
      })
    }

    const { originalImage, processedImage } = req.body || {}

    // Check that both images were supplied.
    if (!originalImage || !processedImage) {
      return res.status(400).json({
        success: false,
        message: 'Both original and processed images are required.',
      })
    }

    // Verify both Cloudinary upload responses.
    const originalIsValid = verifyCloudinaryImage(
      originalImage,
      userId
    )

    const processedIsValid = verifyCloudinaryImage(
      processedImage,
      userId
    )

    // Only retain public IDs that have passed verification.
    if (originalIsValid) {
      originalPublicId = originalImage.public_id
    }

    if (processedIsValid) {
      processedPublicId = processedImage.public_id
    }

    if (!originalIsValid || !processedIsValid) {
      // Clean up any supplied uploads that were successfully verified.
      await Promise.all([
        deleteCloudinaryImage(originalPublicId),
        deleteCloudinaryImage(processedPublicId),
      ])

      originalPublicId = null
      processedPublicId = null

      return res.status(400).json({
        success: false,
        message: 'One or both image uploads could not be verified.',
      })
    }

    // Check monthly project allowance.
    const limit = getMonthlyLimit()
    const used = await getMonthlyProjectCount(userId)

    if (used >= limit) {
      // Prevent unused uploads from accumulating in Cloudinary.
      await Promise.all([
        deleteCloudinaryImage(originalPublicId),
        deleteCloudinaryImage(processedPublicId),
      ])

      originalPublicId = null
      processedPublicId = null

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

    // Prepare project name.
    const projectName =
      typeof req.body.name === 'string'
        ? req.body.name.trim().slice(0, 150)
        : ''

    // Save project information in MongoDB.
    const project = await Project.create({
      user: userId,

      name: projectName || 'Untitled Project',

      originalImage: {
        url: originalImage.secure_url,
        publicId: originalImage.public_id,
      },

      processedImage: {
        url: processedImage.secure_url,
        publicId: processedImage.public_id,
      },

      processingType: 'background-removal',
      status: 'completed',
    })

    // MongoDB now owns the project records.
    // Do not delete their Cloudinary images.
    originalPublicId = null
    processedPublicId = null

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
    })

    // Clean up verified uploads if project saving fails.
    await Promise.all([
      deleteCloudinaryImage(originalPublicId),
      deleteCloudinaryImage(processedPublicId),
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
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

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
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

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
