
import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, ImagePlus, Eraser, Undo2 } from 'lucide-react'

const ImageCanvas = ({
  preview,
  fileName,
  background,
  activeTool = 'Background Remover',
  brushSize = 30,
  brushMode = 'erase',
  backgroundImage,
  hasProcessedImage = false,
  onReplaceImage,
  onEditedImageChange,
}) => {
  const inputRef = useRef(null)
  const canvasRef = useRef(null)
  const maskRef = useRef(null)
  const sourceRef = useRef(null)
  const backgroundRef = useRef(null)

  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)

  const [imageReady, setImageReady] = useState(false)
  const [revision, setRevision] = useState(0)

  // Load the foreground image and prepare its editing mask.
  useEffect(() => {
    if (!preview) {
      sourceRef.current = null
      maskRef.current = null
      setImageReady(false)
      return
    }

    let cancelled = false

    const image = new window.Image()

    image.onload = () => {
      if (cancelled) return

      sourceRef.current = image

      const mask = document.createElement('canvas')
      mask.width = image.naturalWidth
      mask.height = image.naturalHeight

      const context = mask.getContext('2d')

      // White means visible; black means erased.
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, mask.width, mask.height)

      maskRef.current = mask

      const canvas = canvasRef.current

      if (canvas) {
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
      }

      setImageReady(true)
      setRevision((value) => value + 1)
    }

    image.onerror = () => {
      if (!cancelled) {
        setImageReady(false)
      }
    }

    image.src = preview

    return () => {
      cancelled = true
    }
  }, [preview])

  // Load an optional custom background image.
  useEffect(() => {
    if (!backgroundImage) {
      backgroundRef.current = null
      setRevision((value) => value + 1)
      return
    }

    let cancelled = false

    const image = new window.Image()

    image.onload = () => {
      if (cancelled) return

      backgroundRef.current = image
      setRevision((value) => value + 1)
    }

    image.onerror = () => {
      if (!cancelled) {
        backgroundRef.current = null
      }
    }

    image.src = backgroundImage

    return () => {
      cancelled = true
    }
  }, [backgroundImage])

  // Render the foreground, mask and selected background.
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const source = sourceRef.current
    const mask = maskRef.current

    if (!canvas || !source || !mask) return

    const context = canvas.getContext('2d')
    if (!context) return

    const width = canvas.width
    const height = canvas.height

    context.clearRect(0, 0, width, height)

    // Draw a custom image behind the subject.
    if (backgroundRef.current) {
      const image = backgroundRef.current

      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight
      )

      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale

      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      )
    } else if (background && background !== 'transparent') {
      // Draw a solid background.
      context.fillStyle = background
      context.fillRect(0, 0, width, height)
    }

    // Prepare the foreground with its current erasing mask.
    const foreground = document.createElement('canvas')
    foreground.width = width
    foreground.height = height

    const foregroundContext = foreground.getContext('2d')

    foregroundContext.drawImage(source, 0, 0, width, height)
    foregroundContext.globalCompositeOperation = 'destination-in'
    foregroundContext.drawImage(mask, 0, 0)

    // Composite the edited foreground over the background.
    context.drawImage(foreground, 0, 0)

    // Send the actual edited result to Workspace.
    if (hasProcessedImage && onEditedImageChange) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onEditedImageChange(blob)
          }
        },
        'image/png'
      )
    }
  }, [
    background,
    hasProcessedImage,
    onEditedImageChange,
  ])

  useEffect(() => {
    if (imageReady) {
      renderCanvas()
    }
  }, [imageReady, revision, renderCanvas])

  // Convert mouse/touch position into original image coordinates.
  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  // Apply an erase or restore brush to the mask.
  const drawBrush = (point, previousPoint = point) => {
    const mask = maskRef.current
    if (!mask) return

    const context = mask.getContext('2d')

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    const scale = canvas.width / rect.width
    const actualBrushSize = brushSize * scale

    context.save()
    context.globalCompositeOperation = 'source-over'

    context.strokeStyle = brushMode === 'restore'
      ? '#ffffff'
      : '#000000'

    context.fillStyle = context.strokeStyle
    context.lineWidth = actualBrushSize
    context.lineCap = 'round'
    context.lineJoin = 'round'

    context.beginPath()
    context.moveTo(previousPoint.x, previousPoint.y)
    context.lineTo(point.x, point.y)
    context.stroke()

    context.beginPath()
    context.arc(
      point.x,
      point.y,
      actualBrushSize / 2,
      0,
      Math.PI * 2
    )
    context.fill()

    context.restore()

    setRevision((value) => value + 1)
  }

  const handlePointerDown = (event) => {
    if (
      activeTool !== 'Erase' ||
      !hasProcessedImage ||
      !imageReady
    ) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    drawingRef.current = true

    const point = getCanvasPoint(event)

    if (!point) return

    lastPointRef.current = point
    drawBrush(point)
  }

  const handlePointerMove = (event) => {
    if (!drawingRef.current) return

    event.preventDefault()

    const point = getCanvasPoint(event)
    if (!point) return

    drawBrush(point, lastPointRef.current || point)
    lastPointRef.current = point
  }

  const handlePointerUp = (event) => {
    drawingRef.current = false
    lastPointRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  // Restore the original processed image mask.
  const handleResetMask = () => {
    const mask = maskRef.current
    if (!mask) return

    const context = mask.getContext('2d')

    context.clearRect(0, 0, mask.width, mask.height)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, mask.width, mask.height)

    setRevision((value) => value + 1)
  }

  const handleReplace = (event) => {
    const file = event.target.files?.[0]

    if (file && onReplaceImage) {
      onReplaceImage(file)
    }

    event.target.value = ''
  }

  const isEraseMode = activeTool === 'Erase'
  const canEdit = hasProcessedImage && imageReady

  const canvasBackground =
    background === 'transparent'
      ? 'conic-gradient(#e5e7eb 25%, #ffffff 0 50%, #e5e7eb 0 75%, #ffffff 0)'
      : '#f3f4f6'

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">

      {/* Canvas header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-gray-800">
            Image Workspace
          </h2>

          <p className="mt-1 truncate text-[11px] text-gray-400">
            {fileName || 'No image selected'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEraseMode && canEdit && (
            <button
              type="button"
              onClick={handleResetMask}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              title="Restore the original processed image"
            >
              <Undo2 size={14} />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-600 transition hover:bg-violet-50"
          >
            <Upload size={15} />
            Replace
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleReplace}
          className="hidden"
        />
      </div>

      {/* Editing canvas */}
      <div
        className="flex flex-1 items-center justify-center overflow-auto p-5 sm:p-8"
        style={{
          background: canvasBackground,
          backgroundSize: '24px 24px',
        }}
      >
        {preview ? (
          <div className="relative flex max-w-full items-center justify-center">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onLostPointerCapture={() => {
                drawingRef.current = false
                lastPointRef.current = null
              }}
              className={`max-h-[520px] max-w-full rounded-lg object-contain ${
                isEraseMode && canEdit
                  ? brushMode === 'restore'
                    ? 'cursor-cell'
                    : 'cursor-crosshair'
                  : 'cursor-default'
              }`}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '520px',
                touchAction: 'none',
              }}
              aria-label="Editable image canvas"
            />

            {isEraseMode && !canEdit && (
              <div className="absolute inset-x-3 bottom-3 rounded-lg bg-gray-900/80 px-3 py-2 text-center text-xs text-white">
                Remove the background first to use the erase and restore brush.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-sm">
              <ImagePlus size={30} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-gray-700">
              No image loaded
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Return to the Dashboard to select an image.
            </p>
          </div>
        )}
      </div>

      {/* Canvas status */}
      {isEraseMode && canEdit && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eraser size={14} className="text-violet-600" />
            {brushMode === 'restore' ? 'Restore brush active' : 'Erase brush active'}
          </div>

          <span className="text-[11px] text-gray-400">
            Brush: {brushSize}px
          </span>
        </div>
      )}
    </section>
  )
}

export default ImageCanvas
