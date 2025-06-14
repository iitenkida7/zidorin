import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SparkleFilter } from '@/filters/sparkle'

describe('SparkleFilter', () => {
  let filter: SparkleFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new SparkleFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('sparkle')
    expect(filter.name).toBe('キラキラ')
    expect(filter.icon).toBe('✨')
  })

  it('should apply sparkle effect', async () => {
    const width = 100
    const height = 100

    // sparklesを初期化
    ;(filter as any).sparkles = [{ x: 50, y: 50, size: 10, opacity: 1 }]

    await filter.apply(mockCtx, width, height)

    // スパークルエフェクトが描画されることを確認
    expect(mockCtx.save).toHaveBeenCalled()
    expect(mockCtx.restore).toHaveBeenCalled()
  })

  it('should create multiple sparkles', async () => {
    const width = 100
    const height = 100

    // 複数のSparkを初期化
    ;(filter as any).sparkles = [
      { x: 30, y: 30, size: 10, opacity: 1 },
      { x: 70, y: 70, size: 8, opacity: 0.8 }
    ]

    await filter.apply(mockCtx, width, height)

    // 複数のキラキラが描画されることを確認（moveToが複数回呼ばれる）
    expect(vi.mocked(mockCtx.moveTo).mock.calls.length).toBeGreaterThan(1)
  })

  it('should use golden colors for sparkles', async () => {
    const width = 100
    const height = 100

    // sparklesを初期化
    ;(filter as any).sparkles = [{ x: 50, y: 50, size: 10, opacity: 1 }]

    await filter.apply(mockCtx, width, height)

    // グラデーションが作成されることを確認
    expect(mockCtx.createRadialGradient).toHaveBeenCalled()
  })
})