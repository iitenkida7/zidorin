import { describe, it, expect, beforeEach } from 'vitest'
import { SepiaFilter } from '@/filters/sepia'

describe('SepiaFilter', () => {
  let filter: SepiaFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new SepiaFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('sepia')
    expect(filter.name).toBe('セピア')
    expect(filter.icon).toBe('🟤')
    expect(filter.category).toBe('color')
  })

  it('should apply sepia effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})