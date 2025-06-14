import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DogFaceFilter } from '@/filters/dogFace'

vi.mock('@/utils/modelLoader', () => {
  const mockEstimateFaces = vi.fn()
  const mockFaceDetector = {
    estimateFaces: mockEstimateFaces
  }
  
  return {
    modelLoader: {
      getFaceDetector: vi.fn().mockResolvedValue(mockFaceDetector)
    }
  }
})

describe('DogFaceFilter', () => {
  let filter: DogFaceFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new DogFaceFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
    vi.clearAllMocks()
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('dogface')
    expect(filter.name).toBe('犬顔')
    expect(filter.icon).toBe('🐶')
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
    
    // isLoadingをtrueに設定
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(filter as any).isLoading = true

    await filter.apply(mockCtx, width, height)

    const { modelLoader } = await import('@/utils/modelLoader')
    expect(modelLoader.getFaceDetector).not.toHaveBeenCalled()
  })
})