import { Filter } from '../types/filter'

export class CartoonFilter implements Filter {
  id = 'cartoon' as const
  name = 'アニメ'
  icon = '🎬'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Step 1: Color quantization (reduce color palette)
    this.quantizeColors(data, 4) // Reduce to 4 levels per channel
    
    // Step 2: Edge detection and enhancement
    const edges = this.detectEdges(data, width, height)
    
    // Step 3: Apply cartoon effect
    for (let i = 0; i < data.length; i += 4) {
      const edgeStrength = edges[i / 4]
      
      // Enhance saturation for cartoon look
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Convert to HSV for saturation manipulation
      const { h, s, v } = this.rgbToHsv(r, g, b)
      const newS = Math.min(1, s * 1.5) // Boost saturation
      const newV = Math.min(1, v * 1.1) // Slightly boost brightness
      
      const { r: newR, g: newG, b: newB } = this.hsvToRgb(h, newS, newV)
      
      // Apply edge darkening
      const edgeFactor = 1 - edgeStrength * 0.7
      
      data[i] = Math.floor(newR * edgeFactor)
      data[i + 1] = Math.floor(newG * edgeFactor)
      data[i + 2] = Math.floor(newB * edgeFactor)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  private quantizeColors(data: Uint8ClampedArray, levels: number): void {
    const step = 255 / (levels - 1)
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step
      data[i + 1] = Math.round(data[i + 1] / step) * step
      data[i + 2] = Math.round(data[i + 2] / step) * step
    }
  }
  
  private detectEdges(data: Uint8ClampedArray, width: number, height: number): Float32Array {
    const edges = new Float32Array(width * height)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = y * width + x
        
        // Sobel edge detection
        let gx = 0, gy = 0
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const pixelIndex = ((y + dy) * width + (x + dx)) * 4
            const intensity = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
            
            // Sobel kernels
            const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
            const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
            const kernelIndex = (dy + 1) * 3 + (dx + 1)
            
            gx += intensity * sobelX[kernelIndex]
            gy += intensity * sobelY[kernelIndex]
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy) / 255
        edges[index] = Math.min(1, magnitude)
      }
    }
    
    return edges
  }
  
  private rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    
    let h = 0
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6
      else if (max === g) h = (b - r) / diff + 2
      else h = (r - g) / diff + 4
    }
    h /= 6
    if (h < 0) h += 1
    
    const s = max === 0 ? 0 : diff / max
    const v = max
    
    return { h, s, v }
  }
  
  private hsvToRgb(h: number, s: number, v: number): { r: number, g: number, b: number } {
    const c = v * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = v - c
    
    let r = 0, g = 0, b = 0
    
    if (h < 1/6) { r = c; g = x; b = 0 }
    else if (h < 2/6) { r = x; g = c; b = 0 }
    else if (h < 3/6) { r = 0; g = c; b = x }
    else if (h < 4/6) { r = 0; g = x; b = c }
    else if (h < 5/6) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }
}