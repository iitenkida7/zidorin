import { Filter } from '../types/filter'

export class OilFilter implements Filter {
  id = 'oil' as const
  name = '油絵'
  icon = '🎨'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    const outputData = new Uint8ClampedArray(data.length)
    
    const radius = 3
    const intensityLevels = 20
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIndex = (y * width + x) * 4
        
        // Initialize intensity buckets
        const intensityCount = new Array(intensityLevels).fill(0)
        const avgR = new Array(intensityLevels).fill(0)
        const avgG = new Array(intensityLevels).fill(0)
        const avgB = new Array(intensityLevels).fill(0)
        
        // Sample surrounding pixels
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx
            const ny = y + dy
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const index = (ny * width + nx) * 4
              const r = data[index]
              const g = data[index + 1]
              const b = data[index + 2]
              
              // Calculate intensity level
              const intensity = Math.floor((r + g + b) / 3 / 255 * (intensityLevels - 1))
              
              intensityCount[intensity]++
              avgR[intensity] += r
              avgG[intensity] += g
              avgB[intensity] += b
            }
          }
        }
        
        // Find most frequent intensity level
        let maxCount = 0
        let maxIntensity = 0
        
        for (let i = 0; i < intensityLevels; i++) {
          if (intensityCount[i] > maxCount) {
            maxCount = intensityCount[i]
            maxIntensity = i
          }
        }
        
        // Apply the dominant color
        if (maxCount > 0) {
          outputData[centerIndex] = avgR[maxIntensity] / maxCount
          outputData[centerIndex + 1] = avgG[maxIntensity] / maxCount
          outputData[centerIndex + 2] = avgB[maxIntensity] / maxCount
          outputData[centerIndex + 3] = data[centerIndex + 3]
        } else {
          // Fallback to original pixel
          outputData[centerIndex] = data[centerIndex]
          outputData[centerIndex + 1] = data[centerIndex + 1]
          outputData[centerIndex + 2] = data[centerIndex + 2]
          outputData[centerIndex + 3] = data[centerIndex + 3]
        }
      }
    }
    
    // Apply the oil painting effect
    const newImageData = ctx.createImageData(width, height)
    newImageData.data.set(outputData)
    ctx.putImageData(newImageData, 0, 0)
    
    // Add texture overlay
    this.addBrushTexture(ctx, width, height)
  }
  
  private addBrushTexture(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(180, 140, 100, 0.1)'
    
    // Add some random brush strokes
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const length = Math.random() * 30 + 10
      const angle = Math.random() * Math.PI * 2
      
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
      ctx.lineWidth = Math.random() * 2 + 1
      ctx.stroke()
    }
    
    ctx.globalCompositeOperation = 'source-over'
  }
}