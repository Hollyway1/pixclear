
import express from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'

const router = express.Router()

// Authentication rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.',
  },
})

// Environment-aware cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production'
    ? 'none'
    : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

// Generate JWT token
const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Safe user response
const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
})

// SIGNUP
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = req.body

    // Validate required fields
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: 'Please complete all required fields.',
      })
    }

    // Validate email
    const normalizedEmail = email.trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please provide a valid email address.',
      })
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match.',
      })
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    })

    // Generate token
    const token = createToken(user._id)

    // Set authentication cookie
    res.cookie(
      'pixclear_token',
      token,
      cookieOptions
    )

    return res.status(201).json({
      message: 'Account created successfully.',
      user: formatUser(user),
    })

  } catch (error) {
    console.error('Signup error:', error)

    // Handle duplicate email race condition
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    return res.status(500).json({
      message: 'Unable to create your account.',
    })
  }
})

// LOGIN
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password')

    // Verify credentials
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      })
    }

    // Generate token
    const token = createToken(user._id)

    // Set authentication cookie
    res.cookie(
      'pixclear_token',
      token,
      cookieOptions
    )

    return res.json({
      message: 'Login successful.',
      user: formatUser(user),
    })

  } catch (error) {
    console.error('Login error:', error)

    return res.status(500).json({
      message: 'Unable to log in.',
    })
  }
})

// CURRENT AUTHENTICATED USER
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.pixclear_token

    if (!token) {
      return res.status(401).json({
        message: 'Not authenticated.',
      })
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Retrieve user
    const user = await User.findById(
      decoded.userId
    ).select('fullName email')

    if (!user) {
      return res.status(401).json({
        message: 'User account not found.',
      })
    }

    return res.json({
      user: formatUser(user),
    })

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired session.',
    })
  }
})

// LOGOUT
router.post('/logout', (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions

  res.clearCookie(
    'pixclear_token',
    clearOptions
  )

  return res.json({
    message: 'Logged out successfully.',
  })
})

export default router
