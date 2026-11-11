
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Download,
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
  ImagePlus,
} from 'lucide-react'

import { removeBackground } from '../../utils/imageProcessing'
import { saveProject } from '../../services/projectService'

import WorkspaceHeader from '../../components/workspace/WorkspaceHeader'
import EditingToolbar from '../../components/workspace/EditingToolbar'
import ImageCanvas from '../../components/workspace/ImageCanvas'
import BackgroundOptions from '../../components/workspace/BackgroundOptions'

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
]

const MAX_FILE_SIZE = 22 * 1024 * 1024

const Workspace = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [file, setFile] = useState(location.state?.file || null)
  const [preview, setPreview] = useState('')

  // Editing tools
  const [activeTool, setActiveTool] = useState('Background Remover')
  const [background, setBackground] = useState('transparent')
  const [backgroundImage, setBackgroundImage] = useState(null)

  // Eraser controls
  const [brushSize, setBrushSize] = useState(30)
  const [brushMode, setBrushMode] = useState('erase')

  // AI processing
  const [processedImage, setProcessedImage] = useState(null)
  const [processedPreview, setProcessedPreview] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState('')

  // Final edited image returned by the canvas
  const [editedImage, setEditedImage] = useState(null)

  // Project saving
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  // General validation
  const [error, setError] = useState('')

  // Original image preview
  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [file])

  // Processed image preview
  useEffect(() => {
    if (!processedImage) {
      setProcessedPreview('')
      return
    }

    const previewUrl = URL.createObjectURL(processedImage)
    setProcessedPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [processedImage])

  // The currently selected background image preview
  const [backgroundImagePreview, setBackgroundImagePreview] = useState('')

  useEffect(() => {
    if (!backgroundImage) {
      setBackgroundImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(backgroundImage)
    setBackgroundImagePreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [backgroundImage])

  // Replace uploaded image
  const handleReplaceImage = (newFile) => {
    setError('')
    setProcessingError('')
    setSaveError('')
    setSaveSuccess('')

    if (!newFile) return

    if (!ACCEPTED_TYPES.includes(newFile.type)) {
      setError('Please select a PNG, JPG, JPEG or WebP image.')
      return
    }

    if (newFile.size > MAX_FILE_SIZE) {
      setError('Image size must not exceed 22MB.')
      return
    }

    setFile(newFile)
    setProcessedImage(null)
    setEditedImage(null)
    setBackground('transparent')
    setBackgroundImage(null)
    setActiveTool('Background Remover')
    setBrushMode('erase')
  }

  // Run AI background removal
  const handleRemoveBackground = async () => {
    if (!file) {
      setProcessingError('Please upload an image first.')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingError('')
      setSaveError('')
      setSaveSuccess('')
      setEditedImage(null)

      const result = await removeBackground(file)

      if (!(result instanceof Blob) || result.size === 0) {
        throw new Error('The server returned an invalid image.')
      }

      setProcessedImage(result)
      setBackground('transparent')
      setBackgroundImage(null)
      setActiveTool('Background Remover')
    } catch (err) {
      console.error('Pixclear background removal error:', err)

      setProcessingError(
        err.message ||
          'Unable to remove the image background. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Receive the latest exported image from ImageCanvas
  const handleEditedImageChange = (imageBlob) => {
    setEditedImage(imageBlob || null)
    setSaveError('')
    setSaveSuccess('')
  }

  // The edited image takes priority over the AI result
  const finalImage = editedImage || processedImage

  // Save project
  const handleSaveProject = async () => {
    if (!file || !finalImage) {
      setSaveError('Please process an image before saving.')
      return
    }

    try {
      setIsSaving(true)
      setSaveError('')
      setSaveSuccess('')

      const processedFile = new File(
        [finalImage],
        `${file.name.replace(/\.[^/.]+$/, '')}-edited.png`,
        { type: 'image/png' }
      )

      const result = await saveProject({
        originalImage: file,
        processedImage: processedFile,
        name: file.name.replace(/\.[^/.]+$/, ''),
      })

      window.dispatchEvent(new Event('pixclear:projects-updated'))

      setSaveSuccess(result.message || 'Project saved successfully!')
    } catch (err) {
      console.error('Pixclear project saving error:', err)

      setSaveError(
        err.message || 'Unable to save your project. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  // Download a Blob or File
  const downloadImage = (image, fileName) => {
    if (!image) return

    const url = URL.createObjectURL(image)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Download original image
  const handleDownloadOriginal = () => {
    if (!file) return

    downloadImage(file, file.name)
  }

  // Download final edited PNG
  const handleDownloadProcessed = () => {
    if (!finalImage) return

    const name = file?.name?.replace(/\.[^/.]+$/, '') || 'pixclear'

    downloadImage(finalImage, `${name}-edited.png`)
  }

  // Display the processed result when available
  const displayedPreview = processedPreview || preview

  return (
    <main className="min-h-screen bg-[#FAFAFC]">
      <WorkspaceHeader />

      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-7 lg:px-9">

        {/* Page heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-violet-600"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>

            <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              Workspace
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Edit and prepare your image.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownloadOriginal}
              disabled={!file}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Download Original
            </button>

            <button
              type="button"
              onClick={handleDownloadProcessed}
              disabled={!finalImage}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Download PNG
            </button>

            <button
              type="button"
              onClick={handleSaveProject}
              disabled={!finalImage || isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Saving Project...
                </>
              ) : (
                'Save Project'
              )}
            </button>
          </div>
        </div>

        {/* Missing image warning */}
        {!file && (
          <div className="mb-5 flex flex-col items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
            <AlertCircle size={20} className="shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                No image was received.
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Select an image from your Dashboard to begin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xs font-bold text-violet-700 hover:underline sm:ml-auto"
            >
              Open Dashboard
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">

          {/* Editing toolbar */}
          <EditingToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onRemoveBackground={handleRemoveBackground}
            isProcessing={isProcessing}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            brushMode={brushMode}
            onBrushModeChange={setBrushMode}
            hasProcessedImage={Boolean(processedImage)}
          />

          {/* Main editing area */}
          <div className="min-w-0 space-y-5">

            {/* Image canvas */}
            <ImageCanvas
              preview={displayedPreview}
              fileName={file?.name}
              background={background}
              activeTool={activeTool}
              brushSize={brushSize}
              brushMode={brushMode}
              backgroundImage={backgroundImagePreview}
              hasProcessedImage={Boolean(processedImage)}
              onReplaceImage={handleReplaceImage}
              onEditedImageChange={handleEditedImageChange}
            />

            {/* AI background removal */}
            <div className="rounded-xl border border-violet-100 bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    AI Background Removal
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Automatically remove the background from your image.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  disabled={!file || isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Removing Background...
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      {processedImage ? 'Process Again' : 'Remove Background'}
                    </>
                  )}
                </button>
              </div>

              {isProcessing && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-violet-600" />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Pixclear is processing your image. Please wait...
                  </p>
                </div>
              )}

              {processingError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {processingError}
                </div>
              )}

              {processedImage && (
                <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3">
                  <p className="text-sm font-semibold text-green-700">
                    Background removed successfully!
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    Your transparent image is ready for further editing.
                  </p>
                </div>
              )}
            </div>

            {/* Background options */}
            <BackgroundOptions
              selected={background}
              onChange={(value) => {
                setBackground(value)
                setSaveSuccess('')
              }}
              onBackgroundImageChange={(image) => {
                setBackgroundImage(image)
                setSaveSuccess('')
              }}
              activeTool={activeTool}
              hasProcessedImage={Boolean(processedImage)}
            />

            {/* Upload validation error */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Save messages */}
            {saveError && (
              <p
                role="alert"
                className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
              >
                {saveError}
              </p>
            )}

            {saveSuccess && (
              <p
                role="status"
                className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700"
              >
                {saveSuccess}
              </p>
            )}

            {/* Selected tool information */}
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-bold text-violet-700">
                Selected tool: {activeTool}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                {activeTool === 'Background Remover'
                  ? 'Use Pixclear AI to automatically remove your image background.'
                  : activeTool === 'Erase'
                    ? 'Use the brush to erase unwanted areas or restore parts of your image.'
                    : activeTool === 'Colorize'
                      ? 'Apply colours and gradients behind your background-removed image.'
                      : 'Choose or upload a background for your edited image.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-gray-100 py-5 text-center">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Pixclear. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  )
}

export default Workspace
