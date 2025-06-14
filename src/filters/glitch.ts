import { Filter } from '../types/filter'

export class GlitchFilter implements Filter {
  id = 'glitch' as const
  name = 'グリッチ'
  icon = '📺'
  category = 'special' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // RGB channel shift effect
    const shiftAmount = 5
    const tempData = new Uint8ClampedArray(data)
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        
        // Red channel shift right
        if (x + shiftAmount < width) {
          const shiftIndex = (y * width + (x + shiftAmount)) * 4
          data[shiftIndex] = tempData[index]
        }
        
        // Blue channel shift left  
        if (x - shiftAmount >= 0) {
          const shiftIndex = (y * width + (x - shiftAmount)) * 4
          data[shiftIndex + 2] = tempData[index + 2]
        }
      }
    }
    
    // Random horizontal line displacement
    for (let i = 0; i < 20; i++) {
      const y = Math.floor(Math.random() * height)
      const displacement = (Math.random() - 0.5) * 20
      
      if (Math.random() > 0.7) {
        this.shiftLine(data, width, height, y, displacement)
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add static noise overlay
    this.addStaticNoise(ctx, width, height)
  }
  
  private shiftLine(data: Uint8ClampedArray, width: number, height: number, y: number, displacement: number): void {
    if (y < 0 || y >= height) return
    
    const lineStart = y * width * 4
    const lineEnd = (y + 1) * width * 4
    const lineData = data.slice(lineStart, lineEnd)
    
    // Clear the line
    for (let i = lineStart; i < lineEnd; i++) {
      data[i] = 0
    }
    
    // Redraw with displacement
    for (let x = 0; x < width; x++) {
      const newX = Math.floor(x + displacement)
      if (newX >= 0 && newX < width) {
        const sourceIndex = x * 4
        const targetIndex = lineStart + newX * 4
        
        data[targetIndex] = lineData[sourceIndex]
        data[targetIndex + 1] = lineData[sourceIndex + 1]
        data[targetIndex + 2] = lineData[sourceIndex + 2]
        data[targetIndex + 3] = lineData[sourceIndex + 3]
      }
    }
  }
  
  private addStaticNoise(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = 'white'
    for (let i = 0; i < width * height * 0.05; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const opacity = Math.random() * 0.3
      
      ctx.globalAlpha = opacity
      ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1
  }
}