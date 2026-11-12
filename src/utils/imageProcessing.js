
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

// Request a secure upload signature from the backend.
const getUploadSignature = async () => {
  let response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/projects/upload-signature`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch {
    throw new Error(
      'Could not connect to Pixclear server. Please try again.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || 'Unable to prepare image upload.'
    )
  }

  return data
}

// Upload an image directly to Cloudinary.
export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error('Please select an image first.')
  }

  const acceptedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
  ]

  if (!acceptedTypes.includes(file.type)) {
    throw new Error(
      'Unsupported image format. Please use PNG, JPEG, or WebP.'
    )
  }

  if (file.size > 22 * 1024 * 1024) {
    throw new Error('Image size must not exceed 22 MB.')
  }

  const signatureData = await getUploadSignature()

  const {
    cloudName,
    apiKey,
    timestamp,
    folder,
    publicId,
    signature,
  } = signatureData

  if (
    !cloudName ||
    !apiKey ||
    !timestamp ||
    !folder ||
    !publicId ||
    !signature
  ) {
    throw new Error(
      'The server returned incomplete Cloudinary upload information.'
    )
  }

  const formData = new FormData()

  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('folder', folder)
  formData.append('public_id', publicId)
  formData.append('signature', signature)

  let response

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
  } catch {
    throw new Error(
      'Image upload failed. Please check your internet connection.'
    )
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      result.error?.message || 'Unable to upload image to Cloudinary.'
    )
  }

  if (
    !result.secure_url ||
    !result.public_id ||
    !result.version ||
    !result.signature
  ) {
    throw new Error(
      'Cloudinary returned incomplete image information.'
    )
  }

  return result
}

// Remove the background using the Cloudinary image URL.
export const removeBackground = async (file) => {
  if (!file) {
    throw new Error('Please select an image first.')
  }

  // Upload the original image directly to Cloudinary.
  const originalUpload = await uploadImageToCloudinary(file)

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/remove-background`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: originalUpload.secure_url,
        }),
      }
    )
  } catch {
    throw new Error(
      'Could not connect to Pixclear server. Please try again.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || 'Background removal failed.'
    )
  }

  if (!data.imageUrl) {
    throw new Error(
      'The server did not return a processed image URL.'
    )
  }

  // Retrieve the processed image directly from Cloudinary.
  let imageResponse

  try {
    imageResponse = await fetch(data.imageUrl)
  } catch {
    throw new Error(
      'Unable to retrieve the processed image.'
    )
  }

  if (!imageResponse.ok) {
    throw new Error(
      'Unable to download the processed image.'
    )
  }

  const result = await imageResponse.blob()

  if (
    !result.type.startsWith('image/') ||
    result.size === 0
  ) {
    throw new Error(
      'The server did not return a valid processed image.'
    )
  }

  return result
}
