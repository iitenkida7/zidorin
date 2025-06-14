import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VividFilter } from '@/filters/vivid'

describe('VividFilter', () => {
  let filter: VividFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new VividFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('vivid')
    expect(filter.name).toBe('ビビット')
    expect(filter.icon).toBe('🌈')
  })

  it('should apply vivid effect', async () => {
    const width = 100
    const height = 100
    const mockImageData = {
      data: new Uint8ClampedArray(4 * width * height),
      width,
      height,
    }

    // テスト用のピクセルデータを設定
    for (let i = 0; i < mockImageData.data.length; i += 4) {
      mockImageData.data[i] = 100 // R
      mockImageData.data[i + 1] = 150 // G
      mockImageData.data[i + 2] = 200 // B
      mockImageData.data[i + 3] = 255 // A
    }

    vi.mocked(mockCtx.getImageData).mockReturnValue(mockImageData as ImageData)

    await filter.apply(mockCtx, width, height)

    expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, width, height)
    expect(mockCtx.putImageData).toHaveBeenCalled()

    // putImageDataに渡されたデータを確認
    const call = vi.mocked(mockCtx.putImageData).mock.calls[0]
    const processedImageData = call[0] as ImageData
    
    // 彩度が向上しているかチェック（値が変更されている）
    expect(processedImageData.data[0]).not.toBe(100) // R値が変更されている
    expect(processedImageData.data[1]).not.toBe(150) // G値が変更されている
    expect(processedImageData.data[2]).not.toBe(200) // B値が変更されている
    expect(processedImageData.data[3]).toBe(255) // A (変更なし)
  })
})