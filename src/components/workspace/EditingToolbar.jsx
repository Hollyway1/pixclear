
import {
  Eraser,
  Palette,
  WandSparkles,
  Image,
  Layers,
  RotateCcw,
  LoaderCircle,
  Paintbrush,
  Undo2,
} from 'lucide-react'

const tools = [
  { label: 'Erase', icon: Eraser },
  { label: 'Colorize', icon: Palette },
  { label: 'Background Remover', icon: WandSparkles },
  { label: 'Background', icon: Layers },
]

const EditingToolbar = ({
  activeTool,
  onSelectTool,
  onRemoveBackground,
  isProcessing,
  brushSize = 30,
  onBrushSizeChange,
  brushMode = 'erase',
  onBrushModeChange,
  hasProcessedImage = false,
}) => {
  const handleToolClick = (tool) => {
    onSelectTool(tool.label)

    if (
      tool.label === 'Background Remover' &&
      !isProcessing &&
      onRemoveBackground
    ) {
      onRemoveBackground()
    }
  }

  const toolDescriptions = {
    Erase: 'Remove unwanted parts of your image or restore areas you erased.',
    Colorize: 'Apply solid colours and gradients behind your subject.',
    'Background Remover': 'Automatically remove your image background using Pixclear AI.',
    Background: 'Choose a background colour or upload your own background image.',
  }

  return (
    <aside className="w-full shrink-0 rounded-2xl border border-gray-100 bg-white p-4 lg:w-64">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900">
          Editing Tools
        </h2>

        <p className="mt-1 text-[11px] text-gray-400">
          Choose a tool to edit your image.
        </p>
      </div>

      {/* Tool selection */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          const active = activeTool === tool.label
          const isBackgroundRemover =
            tool.label === 'Background Remover'

          return (
            <button
              key={tool.label}
              type="button"
              onClick={() => handleToolClick(tool)}
              disabled={isBackgroundRemover && isProcessing}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                active
                  ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                  : 'border-gray-100 text-gray-600 hover:border-violet-200 hover:bg-violet-50'
              }`}
            >
              {isBackgroundRemover && isProcessing ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Icon size={17} />
              )}

              <span>
                {isBackgroundRemover && isProcessing
                  ? 'Processing...'
                  : tool.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Eraser controls */}
      {activeTool === 'Erase' && (
        <div className="mt-5 border-t border-gray-100 pt-4">

          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800">
              Brush Settings
            </h3>

            <Paintbrush size={15} className="text-violet-600" />
          </div>

          {!hasProcessedImage ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                Background removal required
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-700">
                Remove your image background before using the erase and restore brushes.
              </p>

              <button
                type="button"
                onClick={() => handleToolClick(tools[2])}
                disabled={isProcessing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  <WandSparkles size={14} />
                )}

                Remove Background
              </button>
            </div>
          ) : (
            <>
              {/* Brush mode */}
              <p className="mb-2 text-[11px] font-medium text-gray-500">
                Brush mode
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onBrushModeChange?.('erase')}
                  aria-pressed={brushMode === 'erase'}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                    brushMode === 'erase'
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Eraser size={14} />
                  Erase
                </button>

                <button
                  type="button"
                  onClick={() => onBrushModeChange?.('restore')}
                  aria-pressed={brushMode === 'restore'}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                    brushMode === 'restore'
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Undo2 size={14} />
                  Restore
                </button>
              </div>

              {/* Brush size */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="brush-size"
                    className="text-[11px] font-semibold text-gray-600"
                  >
                    Brush Size
                  </label>

                  <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">
                    {brushSize}px
                  </span>
                </div>

                <input
                  id="brush-size"
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={brushSize}
                  onChange={(event) =>
                    onBrushSizeChange?.(Number(event.target.value))
                  }
                  className="w-full cursor-pointer accent-violet-600"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Colorize information */}
      {activeTool === 'Colorize' && (
        <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-3">
          <div className="flex items-center gap-2 text-violet-700">
            <Palette size={15} />
            <span className="text-xs font-bold">
              Colorize Background
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-gray-600">
            Choose a colour or gradient to place behind your subject. Background removal is required first.
          </p>
        </div>
      )}

      {/* Background information */}
      {activeTool === 'Background' && (
        <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-3">
          <div className="flex items-center gap-2 text-violet-700">
            <Layers size={15} />
            <span className="text-xs font-bold">
              Background Settings
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-gray-600">
            Select a background colour or add a custom image using the background options.
          </p>
        </div>
      )}

      {/* Image preview */}
      <div className="my-5 border-t border-gray-100" />

      <h3 className="mb-3 text-xs font-bold text-gray-800">
        Image Preview
      </h3>

      <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-2">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          <Image size={20} className="text-gray-400" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-gray-700">
            Current image
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            {hasProcessedImage
              ? 'AI processed image'
              : 'Original image'}
          </p>
        </div>
      </div>

      {/* Tool information */}
      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <div className="flex items-center gap-2 text-violet-700">
          <RotateCcw size={14} />

          <span className="text-xs font-bold">
            {activeTool}
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-gray-500">
          {toolDescriptions[activeTool]}
        </p>
      </div>

    </aside>
  )
}

export default EditingToolbar
