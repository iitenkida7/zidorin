import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CloudFilter } from '@/filters/cloud'

describe('CloudFilter', () => {
  let filter: CloudFilter
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new CloudFilter()
    mockCanvas = document.createElement('canvas')
    mockCtx = mockCanvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('cloud')
    expect(filter.name).toBe('雲の中')
    expect(filter.icon).toBe('☁️')
  })

  it('should apply cloud effect', async () => {
    const width = 100
    const height = 100

    await filter.apply(mockCtx, width, height)

    // 雲のエフェクトが描画されることを確認
    expect(mockCtx.save).toHaveBeenCalled()
    expect(mockCtx.restore).toHaveBeenCalled()
    expect(mockCtx.fillRect).toHaveBeenCalled()
  })

  it('should use white color for clouds', async () => {
    const width = 100
    const height = 100

    await filter.apply(mockCtx, width, height)

    // 白色の雲が描画されることを確認
    expect(mockCtx.fillStyle).toBe('rgba(255, 255, 255, 0.3)')
  })
})