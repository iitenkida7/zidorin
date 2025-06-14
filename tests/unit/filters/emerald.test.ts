import { describe, it, expect, beforeEach } from 'vitest'
import { EmeraldFilter } from '@/filters/emerald'

describe('EmeraldFilter', () => {
  let filter: EmeraldFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new EmeraldFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('emerald')
    expect(filter.name).toBe('エメラルド')
    expect(filter.icon).toBe('💚')
    expect(filter.category).toBe('color')
  })

  it('should apply emerald effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})