
import api from '../utils/api'
import { uploadImageToCloudinary } from '../utils/imageProcessing'

// Save a completed project.
export const saveProject = async ({
  originalImage,
  processedImage,
  name,
}) => {
  if (!originalImage || !processedImage) {
    throw new Error(
      'Both original and processed images are required.'
    )
  }

  // Upload the original image directly to Cloudinary.
  const originalUpload = await uploadImageToCloudinary(
    originalImage
  )

  // Upload the processed image directly to Cloudinary.
  const processedUpload = await uploadImageToCloudinary(
    processedImage
  )

  // Save only image metadata through the backend.
  return api('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: name || 'Untitled Project',

      originalImage: {
        secure_url: originalUpload.secure_url,
        public_id: originalUpload.public_id,
        version: originalUpload.version,
        signature: originalUpload.signature,
      },

      processedImage: {
        secure_url: processedUpload.secure_url,
        public_id: processedUpload.public_id,
        version: processedUpload.version,
        signature: processedUpload.signature,
      },
    }),
  })
}

// Get all saved projects.
export const getProjects = async () => {
  return api('/api/projects')
}

// Get one project.
export const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required.')
  }

  return api(`/api/projects/${projectId}`)
}

// Get usage information.
export const getUsage = async () => {
  return api('/api/projects/usage')
}

// Delete a project.
export const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required.')
  }

  return api(`/api/projects/${projectId}`, {
    method: 'DELETE',
  })
}
