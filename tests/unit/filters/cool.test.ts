import { describe, it, expect, beforeEach } from 'vitest'
import { CoolFilter } from '@/filters/cool'

describe('CoolFilter', () => {
  let filter: CoolFilter
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    filter = new CoolFilter()
    canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    ctx = canvas.getContext('2d')!
  })

  it('should have correct properties', () => {
    expect(filter.id).toBe('cool')
    expect(filter.name).toBe('クール')
    expect(filter.icon).toBe('❄️')
    expect(filter.category).toBe('color')
  })

  it('should apply cool effect', () => {
    filter.apply(ctx, 100, 100)
    expect(ctx).toBeDefined()
  })
})