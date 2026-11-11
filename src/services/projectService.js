
import api from '../utils/api'

// Save a completed project
export const saveProject = async ({
  originalImage,
  processedImage,
  name,
}) => {
  const formData = new FormData()

  formData.append('originalImage', originalImage)
  formData.append('processedImage', processedImage)
  formData.append('name', name || 'Untitled Project')

  return api('/api/projects', {
    method: 'POST',
    body: formData,
  })
}

// Get all saved projects
export const getProjects = async () => {
  return api('/api/projects')
}

// Get one project
export const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required.')
  }

  return api(`/api/projects/${projectId}`)
}

// Get usage information
export const getUsage = async () => {
  return api('/api/projects/usage')
}

// Delete a project
export const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required.')
  }

  return api(`/api/projects/${projectId}`, {
    method: 'DELETE',
  })
}
