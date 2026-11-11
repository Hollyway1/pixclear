
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const requiredVariables = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
)

if (missingVariables.length > 0) {
  console.error(
    `Cloudinary configuration is missing: ${missingVariables.join(', ')}`
  )
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  console.log('Cloudinary configured successfully.')
}

export default cloudinary
