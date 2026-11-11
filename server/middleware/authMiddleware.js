
import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {
  try {
    // Ensure JWT secret is configured.
    if (!process.env.JWT_SECRET) {
      console.error('AUTH: JWT_SECRET is not configured.')

      return res.status(500).json({
        success: false,
        message: 'Authentication service is not properly configured.',
      })
    }

    // Get authentication token from HTTP-only cookie.
    const token = req.cookies?.pixclear_token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in again.',
      })
    }

    // Verify authentication token.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Extract authenticated user ID.
    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id

    if (
      !userId ||
      typeof userId !== 'string' ||
      !userId.trim()
    ) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.',
      })
    }

    // Attach authenticated user ID to request.
    req.userId = userId

    next()

  } catch (error) {
    console.error(
      'AUTH: Authentication failed:',
      error.name
    )

    return res.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired. Please log in again.',
    })
  }
}

export default protect
