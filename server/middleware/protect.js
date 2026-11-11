
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.pixclear_token

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required. Please log in.',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        message: 'User account not found.',
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication session.',
    })
  }
}

export default protect
