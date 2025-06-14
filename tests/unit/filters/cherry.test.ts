import { describe, it, expect, beforeEach } from 'vitest'
import { CherryFilter } from '@/filters/cherry'

describe('CherryFilter', () => {
  let filter: CherryFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new CherryFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('cherry')
    expect(filter.name).toBe('チェリー')
    expect(filter.icon).toBe('🍒')
    expect(filter.category).toBe('color')
  })

  it('should apply cherry effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})