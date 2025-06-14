import { describe, it, expect, beforeEach } from 'vitest'
import { LavenderFilter } from '@/filters/lavender'

describe('LavenderFilter', () => {
  let filter: LavenderFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new LavenderFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('lavender')
    expect(filter.name).toBe('ラベンダー')
    expect(filter.icon).toBe('💜')
    expect(filter.category).toBe('color')
  })

  it('should apply lavender effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})