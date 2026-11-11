
import mongoose from 'mongoose'

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null,
  }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise

    console.log(
      `MongoDB connected successfully: ${cached.conn.connection.host}`
    )

    return cached.conn
  } catch (error) {
    cached.promise = null

    console.error('MongoDB connection failed:', error.message)

    throw error
  }
}

export default connectDB
