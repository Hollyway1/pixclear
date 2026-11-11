
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

export const removeBackground = async (file) => {
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
    credentials: 'include',
    body: formData,
  }
)
  } catch (error) {
    throw new Error(
      'Could not connect to Pixclear server. Make sure your backend is running.'
    )
  }

  if (!response.ok) {
    let message = 'Background removal failed.'

    try {
      const data = await response.json()
      message = data.message || data.error || message
    } catch {
      // Use the default error message.
    }

    throw new Error(message)
  }

  const result = await response.blob()

  if (!result.type.startsWith('image/') || result.size === 0) {
    throw new Error('The server did not return a valid processed image.')
  }

  return result
}
