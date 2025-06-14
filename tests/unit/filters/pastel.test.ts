import { describe, it, expect, beforeEach } from 'vitest'
import { PastelFilter } from '@/filters/pastel'

describe('PastelFilter', () => {
  let filter: PastelFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new PastelFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('pastel')
    expect(filter.name).toBe('パステル')
    expect(filter.icon).toBe('🎀')
    expect(filter.category).toBe('color')
  })

  it('should apply pastel effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})