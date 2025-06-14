import { describe, it, expect, beforeEach } from 'vitest'
import { OceanFilter } from '@/filters/ocean'

describe('OceanFilter', () => {
  let filter: OceanFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new OceanFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('ocean')
    expect(filter.name).toBe('オーシャン')
    expect(filter.icon).toBe('🌊')
    expect(filter.category).toBe('color')
  })

  it('should apply ocean effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})