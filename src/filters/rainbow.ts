import { Filter } from '../types/filter'

export class RainbowFilter implements Filter {
  id = 'rainbow' as const
  name = 'レインボー'
  icon = '🌈'
  category = 'color' as const
  private time = 0
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.time += 0.02
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width
      const y = Math.floor(i / 4 / width)
      
      // Create rainbow wave effect
      const hue = (x / width * 360 + y / height * 180 + this.time * 100) % 360
      const saturation = 0.8
      const lightness = 0.6
      
      // Convert HSL to RGB and blend with original
      const rgb = this.hslToRgb(hue / 360, saturation, lightness)
      
      data[i] = Math.min(255, data[i] * 0.7 + rgb[0] * 0.3)
      data[i + 1] = Math.min(255, data[i + 1] * 0.7 + rgb[1] * 0.3)
      data[i + 2] = Math.min(255, data[i + 2] * 0.7 + rgb[2] * 0.3)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2
    
    let r = 0, g = 0, b = 0
    
    if (h < 1/6) { r = c; g = x; b = 0 }
    else if (h < 2/6) { r = x; g = c; b = 0 }
    else if (h < 3/6) { r = 0; g = c; b = x }
    else if (h < 4/6) { r = 0; g = x; b = c }
    else if (h < 5/6) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
  }
}