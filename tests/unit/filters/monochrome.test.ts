import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MonochromeFilter } from '@/filters/monochrome'

describe('MonochromeFilter', () => {
  let filter: MonochromeFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new MonochromeFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('monochrome')
    expect(filter.name).toBe('モノクロ')
    expect(filter.icon).toBe('⚫')
  })

  it('should apply monochrome effect', async () => {
    const width = 100
    const height = 100
    const mockImageData = {
      data: new Uint8ClampedArray(4 * width * height),
      width,
      height,
    }

    // テスト用のカラーピクセルデータを設定
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
    
    // 最初のピクセルがグレースケールに変換されているかチェック
    const grayValue = Math.round(100 * 0.299 + 150 * 0.587 + 200 * 0.114)
    expect(processedImageData.data[0]).toBe(grayValue) // R
    expect(processedImageData.data[1]).toBe(grayValue) // G
    expect(processedImageData.data[2]).toBe(grayValue) // B
    expect(processedImageData.data[3]).toBe(255) // A (変更なし)
  })
})