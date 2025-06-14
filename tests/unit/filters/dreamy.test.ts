import { describe, it, expect, beforeEach } from 'vitest'
import { DreamyFilter } from '@/filters/dreamy'

describe('DreamyFilter', () => {
  let filter: DreamyFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new DreamyFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('dreamy')
    expect(filter.name).toBe('ドリーミー')
    expect(filter.icon).toBe('✨')
    expect(filter.category).toBe('color')
  })

  it('should apply dreamy effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})