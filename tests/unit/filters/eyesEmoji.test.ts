import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EyesEmojiFilter } from '@/filters/eyesEmoji'

vi.mock('@/utils/modelLoader', () => ({
  modelLoader: {
    getFaceDetector: vi.fn().mockResolvedValue({
      estimateFaces: vi.fn()
    })
  }
}))

describe('EyesEmojiFilter', () => {
  let filter: EyesEmojiFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new EyesEmojiFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
    vi.clearAllMocks()
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('eyesemoji')
    expect(filter.name).toBe('目が👀')
    expect(filter.icon).toBe('👀')
  })

  it('should load face detector when applying filter', async () => {
    const width = 100
    const height = 100

    await filter.apply(mockCtx, width, height)

    const { modelLoader } = await import('@/utils/modelLoader')
    expect(modelLoader.getFaceDetector).toHaveBeenCalled()
  })

  it('should not apply filter when already loading', async () => {
    const width = 100
    const height = 100
    
    ;(filter as any).isLoading = true

    await filter.apply(mockCtx, width, height)

    const { modelLoader } = await import('@/utils/modelLoader')
    expect(modelLoader.getFaceDetector).not.toHaveBeenCalled()
  })
})