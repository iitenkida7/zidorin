import { describe, it, expect, beforeEach } from 'vitest'
import { SunsetFilter } from '@/filters/sunset'

describe('SunsetFilter', () => {
  let filter: SunsetFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new SunsetFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('sunset')
    expect(filter.name).toBe('サンセット')
    expect(filter.icon).toBe('🌅')
    expect(filter.category).toBe('color')
  })

  it('should apply sunset effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})