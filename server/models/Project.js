
import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required.'],
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, 'Image public ID is required.'],
      trim: true,
    },
  },
  {
    _id: false,
  }
)

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 150,
      default: 'Untitled Project',
    },

    originalImage: {
      type: imageSchema,
      required: true,
    },

    processedImage: {
      type: imageSchema,
      required: true,
    },

    processingType: {
      type: String,
      enum: ['background-removal'],
      default: 'background-removal',
    },

    status: {
      type: String,
      enum: ['completed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
)

// Optimize retrieval of a user's projects by date.
projectSchema.index({
  user: 1,
  createdAt: -1,
})

const Project = mongoose.model(
  'Project',
  projectSchema
)

export default Project
