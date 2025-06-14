import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MakeupFilter } from '@/filters/makeup'

vi.mock('@/utils/modelLoader', () => ({
  modelLoader: {
    getFaceDetector: vi.fn().mockResolvedValue({
      estimateFaces: vi.fn()
    })
  }
}))

describe('MakeupFilter', () => {
  let filter: MakeupFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D
  let mockImageData: ImageData

  beforeEach(() => {
    filter = new MakeupFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
    
    // モックImageDataを作成
    mockImageData = {
      data: new Uint8ClampedArray(4 * 100 * 100),
      width: 100,
      height: 100
    } as ImageData

    // 肌色のピクセルデータを設定
    for (let i = 0; i < mockImageData.data.length; i += 4) {
      mockImageData.data[i] = 180 // R
      mockImageData.data[i + 1] = 140 // G 
      mockImageData.data[i + 2] = 120 // B
      mockImageData.data[i + 3] = 255 // A
    }

    vi.mocked(mockCtx.getImageData).mockReturnValue(mockImageData)
    vi.clearAllMocks()
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('makeup')
    expect(filter.name).toBe('メイクアップ')
    expect(filter.icon).toBe('💄')
  })

  it('should apply skin smoothing effect', async () => {
    const width = 100
    const height = 100

    await filter.apply(mockCtx, width, height)

    expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, width, height)
    expect(mockCtx.putImageData).toHaveBeenCalled()

    // 美肌効果で肌色が明るくなることを確認
    const call = vi.mocked(mockCtx.putImageData).mock.calls[0]
    const processedImageData = call[0] as ImageData
    
    // 肌色部分が明るくなっていることを確認
    expect(processedImageData.data[0]).toBeGreaterThan(180) // R値が向上
    expect(processedImageData.data[1]).toBeGreaterThan(140) // G値が向上
    expect(processedImageData.data[2]).toBeGreaterThan(120) // B値が向上
  })

  it('should load face detector when face is needed', async () => {
    const width = 100
    const height = 100

    await filter.apply(mockCtx, width, height)

    const { modelLoader } = await import('@/utils/modelLoader')
    expect(modelLoader.getFaceDetector).toHaveBeenCalled()
  })

  it('should not apply face effects when already loading', async () => {
    const width = 100
    const height = 100
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(filter as any).isLoading = true

    await filter.apply(mockCtx, width, height)

    const { modelLoader } = await import('@/utils/modelLoader')
    expect(modelLoader.getFaceDetector).not.toHaveBeenCalled()
  })
})