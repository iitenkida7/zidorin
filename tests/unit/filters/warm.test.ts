import { describe, it, expect, beforeEach } from 'vitest'
import { WarmFilter } from '@/filters/warm'

describe('WarmFilter', () => {
  let filter: WarmFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new WarmFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('warm')
    expect(filter.name).toBe('ウォーム')
    expect(filter.icon).toBe('🔥')
    expect(filter.category).toBe('color')
  })

  it('should apply warm effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})