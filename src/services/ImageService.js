
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

export const removeImageBackground = async (file) => {
  if (!file) {
    throw new Error('Please select an image first.')
  }

  const formData = new FormData()
  formData.append('image', file)

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/remove-background`,
      {
        method: 'POST',
        body: formData,
      }
    )
  } catch {
    throw new Error(
      'Unable to connect to Pixclear server. Check that your backend is running.'
    )
  }

  if (!response.ok) {
    let message = 'Background removal failed.'

    try {
      const data = await response.json()
      message = data.error || message
    } catch {
      // Keep the default error message.
    }

    throw new Error(message)
  }

  const result = await response.blob()

  if (!result.type.includes('image/')) {
    throw new Error('The server did not return a valid image.')
  }

  return result
}
