import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AgeGenderFilter } from '@/filters/ageGender'

vi.mock('@/utils/modelLoader', () => ({
  modelLoader: {
    getFaceDetector: vi.fn().mockResolvedValue({
      estimateFaces: vi.fn()
    })
  }
}))

describe('AgeGenderFilter', () => {
  let filter: AgeGenderFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new AgeGenderFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
    vi.clearAllMocks()
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('agegender')
    expect(filter.name).toBe('年齢・性別')
    expect(filter.icon).toBe('🧠')
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