
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(
    this.password,
    12
  )
})

// Compare supplied password with stored password hash.
userSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    return false
  }

  return bcrypt.compare(
    password,
    this.password
  )
}

const User = mongoose.model('User', userSchema)

export default User
