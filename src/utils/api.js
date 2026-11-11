
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

const api = async (endpoint, options = {}) => {
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`

  const isFormData = options.body instanceof FormData

  const headers = {
    ...(!isFormData && options.body !== undefined
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...options.headers,
  }

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}${normalizedEndpoint}`,
      {
        ...options,
        credentials: 'include',
        headers,
      }
    )
  } catch (error) {
    console.error('API connection error:', error)

    throw new Error(
      'Unable to connect to the server. Please check your internet connection or try again.'
    )
  }

  let data = null

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    const text = await response.text().catch(() => '')

    if (text) {
      data = { message: text }
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}.`
    )
  }

  return data
}

export default api
