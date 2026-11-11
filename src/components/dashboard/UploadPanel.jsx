
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  ImagePlus,
  X,
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  FileImage,
  CheckCircle2,
} from 'lucide-react'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_FILE_SIZE = 22 * 1024 * 1024

const UploadPanel = () => {
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  // Generate and clean up image preview.
  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)

    return () => URL.revokeObjectURL(imageUrl)
  }, [file])

  // Validate selected image.
  const handleFile = (selectedFile) => {
    setError('')

    if (!selectedFile) return

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError('Please select a PNG, JPG, JPEG or WebP image.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('Image size must not exceed 22MB.')
      return
    }

    setFile(selectedFile)
  }

  // File picker.
  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      handleFile(selectedFile)
    }

    event.target.value = ''
  }

  // Drag and drop.
  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)

    const selectedFile = event.dataTransfer.files?.[0]
    handleFile(selectedFile)
  }

  // Continue to image workspace.
  const handleContinue = () => {
    if (!file) return

    navigate('/workspace', {
      state: {
        file,
        fileName: file.name,
      },
    })
  }

  // Remove selected image.
  const handleRemove = () => {
    setFile(null)
    setError('')
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">

      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative p-5 sm:p-7 lg:p-8">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Sparkles size={17} />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                AI Image Studio
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl">
              Remove Image Background
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Upload your image and let PixClear intelligently remove
              the background in seconds.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              Secure Processing
            </span>
          </div>

        </div>

        {/* Hidden file input */}
        <input
          id="pixclear-image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleInputChange}
          className="sr-only"
        />

        {!file ? (

          /* Upload Area */
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setDragging(false)
              }
            }}
            onDrop={handleDrop}
            className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-300 sm:p-12 ${
              dragging
                ? 'scale-[1.01] border-violet-500 bg-violet-100/80 shadow-lg shadow-violet-100'
                : 'border-violet-200 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/60 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100/50'
            }`}
          >

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-violet-100/70" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-indigo-100/70" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-100 bg-white text-violet-600 shadow-xl shadow-violet-100/70 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105">

              <UploadCloud size={34} strokeWidth={1.7} />

              <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-violet-600 text-white shadow-md">
                <ImagePlus size={15} />
              </span>
            </div>

            <h3 className="relative mt-7 text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl">
              {dragging
                ? 'Drop your image here'
                : 'Drag and drop your image'}
            </h3>

            <p className="relative mt-2 text-sm text-gray-500">
              Your image is just one step away from a clean background.
            </p>

            <div className="relative my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <label
              htmlFor="pixclear-image-upload"
              className="relative inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-200 active:scale-95"
            >
              <ImagePlus size={18} />
              Choose Image
              <ArrowRight size={16} />
            </label>

            <p className="relative mt-5 text-xs text-gray-400">
              Supported formats: PNG, JPG, JPEG and WebP
            </p>

            <p className="relative mt-1 text-xs font-medium text-gray-500">
              Maximum file size: 22MB
            </p>

          </div>

        ) : (

          /* Selected Image Area */
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-4 sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Your Image
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Ready for background removal
                </p>
              </div>

              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={14} />
                Ready
              </span>

            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Image preview */}
              <div className="relative flex h-52 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white sm:h-44 sm:w-56">

                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />

                <img
                  src={preview}
                  alt="Selected image preview"
                  className="relative z-10 h-full w-full object-contain p-3"
                />

                <span className="absolute bottom-3 left-3 z-20 rounded-md bg-gray-900/75 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  IMAGE PREVIEW
                </span>

              </div>

              {/* File details */}
              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2 text-violet-600">
                  <FileImage size={19} />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Selected File
                  </span>
                </div>

                <p className="mt-3 break-all text-base font-bold text-gray-900">
                  {file.name}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">

                  <span className="rounded-md bg-white px-2.5 py-1.5 font-semibold">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>

                  <span className="rounded-md bg-white px-2.5 py-1.5 font-semibold uppercase">
                    {file.type.split('/')[1]}
                  </span>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                  >
                    Continue to Workspace
                    <ArrowRight size={16} />
                  </button>

                  <label
                    htmlFor="pixclear-image-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <ImagePlus size={15} />
                    Replace
                  </label>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={15} />
                    Remove
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <X size={18} className="mt-0.5 shrink-0 text-red-500" />

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Bottom information */}
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>Your image is handled securely.</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <ImageIcon size={14} />
            <span>Powered by PixClear AI</span>
          </div>

        </div>

      </div>
    </section>
  )
}

export default UploadPanel
