import { Filter } from '../types/filter'

export class ThermalFilter implements Filter {
  id = 'thermal' as const
  name = 'サーモ'
  icon = '🔥'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Convert to thermal vision effect
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate intensity based on brightness
      const intensity = (r * 0.299 + g * 0.587 + b * 0.114) / 255
      
      // Map intensity to thermal colors
      if (intensity < 0.25) {
        // Cold - dark blue/purple
        data[i] = Math.floor(intensity * 4 * 100)
        data[i + 1] = 0
        data[i + 2] = Math.floor(intensity * 4 * 200)
      } else if (intensity < 0.5) {
        // Cool - blue to cyan
        const t = (intensity - 0.25) * 4
        data[i] = 0
        data[i + 1] = Math.floor(t * 200)
        data[i + 2] = Math.floor(255 - t * 100)
      } else if (intensity < 0.75) {
        // Warm - cyan to yellow
        const t = (intensity - 0.5) * 4
        data[i] = Math.floor(t * 255)
        data[i + 1] = 255
        data[i + 2] = Math.floor(255 - t * 255)
      } else {
        // Hot - yellow to red
        const t = (intensity - 0.75) * 4
        data[i] = 255
        data[i + 1] = Math.floor(255 - t * 255)
        data[i + 2] = 0
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}