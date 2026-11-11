
import { useRef, useState } from 'react'
import {
  ImagePlus,
  Check,
  Palette,
  Layers,
  X,
} from 'lucide-react'

const solidBackgrounds = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Black', value: '#171717' },
  { label: 'Violet', value: '#EDE9FE' },
  { label: 'Blue', value: '#DBEAFE' },
  { label: 'Pink', value: '#FCE7F3' },
  { label: 'Green', value: '#DCFCE7' },
  { label: 'Orange', value: '#FFEDD5' },
]

const gradientBackgrounds = [
  {
    label: 'Sunset',
    value: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
  },
  {
    label: 'Purple Dream',
    value: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  },
  {
    label: 'Ocean',
    value: 'linear-gradient(135deg, #2193B0 0%, #6DD5ED 100%)',
  },
  {
    label: 'Rose',
    value: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  },
  {
    label: 'Fresh',
    value: 'linear-gradient(135deg, #56AB2F 0%, #A8E063 100%)',
  },
  {
    label: 'Midnight',
    value: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  },
]

const BackgroundOptions = ({
  selected,
  onChange,
  onBackgroundImageChange,
  activeTool,
  hasProcessedImage = false,
}) => {
  const inputRef = useRef(null)

  const [customColor, setCustomColor] = useState('#8B5CF6')
  const [uploadError, setUploadError] = useState('')
  const [selectedImageName, setSelectedImageName] = useState('')

  const isCustomBackground = selected?.startsWith('#')
  const isGradient = selected?.startsWith('linear-gradient')

  const handleCustomColor = (event) => {
    const color = event.target.value

    setCustomColor(color)
    setUploadError('')
    onChange(color)
  }

  const handleBackgroundUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setUploadError('')

    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ]

    if (!acceptedTypes.includes(file.type)) {
      setUploadError('Please upload a PNG, JPG, JPEG or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > 22 * 1024 * 1024) {
      setUploadError('Background image must not exceed 22MB.')
      event.target.value = ''
      return
    }

    setSelectedImageName(file.name)
    onBackgroundImageChange?.(file)

    event.target.value = ''
  }

  const handleRemoveBackgroundImage = () => {
    onBackgroundImageChange?.(null)
    setSelectedImageName('')
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Palette size={19} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Background Studio
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Customize the background behind your subject.
          </p>
        </div>
      </div>

      {!hasProcessedImage && (
        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-800">
            Background removal recommended
          </p>

          <p className="mt-1 text-[11px] leading-5 text-amber-700">
            Remove your image background first to see your selected background behind the subject.
          </p>
        </div>
      )}

      {/* Solid colours */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-800">
            Solid Colours
          </h4>

          <span className="text-[10px] text-gray-400">
            {solidBackgrounds.length} presets
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {solidBackgrounds.map((item) => {
            const active = selected === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange(item.value)}
                title={item.label}
                aria-label={`${item.label} background`}
                aria-pressed={active}
                className={`group flex flex-col items-center gap-2 rounded-xl border p-2 transition ${
                  active
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                }`}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 shadow-sm"
                  style={{
                    background:
                      item.value === 'transparent'
                        ? 'conic-gradient(#ddd 25%, white 0 50%, #ddd 0 75%, white 0)'
                        : item.value,
                    backgroundSize: '12px 12px',
                  }}
                >
                  {active && (
                    <Check
                      size={15}
                      className={
                        item.value === '#171717'
                          ? 'text-white'
                          : 'text-violet-700'
                      }
                    />
                  )}
                </span>

                <span className="text-[9px] font-medium text-gray-500">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom colour */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <h4 className="mb-3 text-xs font-bold text-gray-800">
          Custom Colour
        </h4>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColor}
            aria-label="Choose custom background colour"
            className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700">
              Choose any colour
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              {isCustomBackground ? selected : customColor}
            </p>
          </div>

          {isCustomBackground && (
            <Check size={17} className="text-violet-600" />
          )}
        </div>
      </div>

      {/* Gradients */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <Layers size={15} className="text-violet-600" />

          <h4 className="text-xs font-bold text-gray-800">
            Gradient Backgrounds
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gradientBackgrounds.map((item) => {
            const active = selected === item.value

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onChange(item.value)}
                aria-label={`${item.label} gradient`}
                aria-pressed={active}
                className={`relative h-20 overflow-hidden rounded-xl border-2 transition hover:scale-[1.02] ${
                  active
                    ? 'border-violet-600 ring-2 ring-violet-100'
                    : 'border-transparent'
                }`}
                style={{ background: item.value }}
              >
                <span className="absolute inset-x-0 bottom-0 bg-black/25 px-2 py-2 text-left text-[10px] font-semibold text-white">
                  {item.label}
                </span>

                {active && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <Check size={12} className="text-violet-700" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom background image */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <h4 className="mb-3 text-xs font-bold text-gray-800">
          Custom Background Image
        </h4>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleBackgroundUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center transition hover:border-violet-400 hover:bg-violet-50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
            <ImagePlus size={21} />
          </span>

          <span className="mt-3 text-xs font-bold text-gray-700">
            Upload a background
          </span>

          <span className="mt-1 text-[10px] text-gray-400">
            PNG, JPG or WebP · Maximum 22MB
          </span>
        </button>

        {selectedImageName && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-violet-100 bg-violet-50 p-3">
            <div className="flex min-w-0 items-center gap-2">
              <ImagePlus size={15} className="shrink-0 text-violet-600" />

              <span className="truncate text-xs font-medium text-gray-700">
                {selectedImageName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRemoveBackgroundImage}
              title="Remove custom background"
              aria-label="Remove custom background"
              className="rounded-md p-1 text-gray-500 transition hover:bg-white hover:text-red-600"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {uploadError && (
          <p role="alert" className="mt-3 text-xs text-red-600">
            {uploadError}
          </p>
        )}
      </div>

      {/* Information */}
      <div className="mt-5 rounded-xl bg-violet-50 p-3">
        <p className="text-[11px] leading-5 text-violet-800">
          Your selected background will be combined with your transparent subject when the canvas is exported.
        </p>
      </div>
    </section>
  )
}

export default BackgroundOptions
