import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { BodySegmenter } from '../types/tensorflow'

export class UnderwaterBackgroundFilter implements Filter {
  id = 'underwater' as const
  name = '海の中'
  icon = '🌊'
  category = 'background' as const
  private segmenter: BodySegmenter | null = null
  private isLoading = false
  private bubbles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = []
  private time = 0
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    this.time += 0.03
    
    if (this.isLoading) return
    
    if (!this.segmenter) {
      this.isLoading = true
      try {
        this.segmenter = await modelLoader.getBodySegmenter()
      } catch (error) {
        console.error('Body segmenter loading failed:', error)
        this.isLoading = false
        return
      }
      this.isLoading = false
    }
    
    // Add new bubbles
    if (Math.random() > 0.9) {
      this.bubbles.push({
        x: Math.random() * width,
        y: height + 10,
        size: Math.random() * 15 + 5,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2
      })
    }
    
    try {
      const canvas = ctx.canvas
      const segmentation = await this.segmenter!.segmentPeople(canvas)
      
      if (segmentation && segmentation.length > 0) {
        const mask = segmentation[0].mask
        const imageData = ctx.getImageData(0, 0, width, height)
        const backgroundData = ctx.createImageData(width, height)
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = y * width + x
            const pixelIndex = i * 4
            
            if (mask.getValueAt && mask.getValueAt(x, y) === 0) {
              // Background pixel - create underwater effect
              const depth = y / height
              const wave = Math.sin(x * 0.02 + this.time * 2) * 10 + Math.sin(x * 0.03 + this.time * 1.5) * 5
              const distortedY = y + wave
              
              // Underwater blue gradient
              const blueIntensity = 100 + depth * 100
              const greenIntensity = 150 + depth * 50
              
              // Add caustic light patterns
              const caustic = Math.sin(x * 0.1 + this.time) * Math.sin(distortedY * 0.08 + this.time * 0.7) * 30
              
              backgroundData.data[pixelIndex] = Math.max(0, 20 + caustic * 0.5)
              backgroundData.data[pixelIndex + 1] = Math.max(0, greenIntensity + caustic)
              backgroundData.data[pixelIndex + 2] = Math.max(0, blueIntensity + caustic * 0.7)
              backgroundData.data[pixelIndex + 3] = 255
            } else {
              // Person pixel - keep original but add slight blue tint
              const blueTint = 0.1
              backgroundData.data[pixelIndex] = imageData.data[pixelIndex] * (1 - blueTint * 0.5)
              backgroundData.data[pixelIndex + 1] = imageData.data[pixelIndex + 1] * (1 - blueTint * 0.3)
              backgroundData.data[pixelIndex + 2] = Math.min(255, imageData.data[pixelIndex + 2] * (1 + blueTint))
              backgroundData.data[pixelIndex + 3] = imageData.data[pixelIndex + 3]
            }
          }
        }
        
        ctx.putImageData(backgroundData, 0, 0)
        
        // Draw floating bubbles
        this.bubbles = this.bubbles.filter(bubble => {
          bubble.y -= bubble.speed
          bubble.x += Math.sin(bubble.y * 0.01) * 0.5 // gentle drift
          
          if (bubble.y > -50) {
            ctx.save()
            ctx.globalAlpha = bubble.opacity
            
            // Bubble gradient
            const gradient = ctx.createRadialGradient(
              bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, 0,
              bubble.x, bubble.y, bubble.size
            )
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
            gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.4)')
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0.1)')
            
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Bubble highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
            ctx.beginPath()
            ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.2, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.restore()
            return true
          }
          return false
        })
        
        // Add seaweed or kelp
        for (let i = 0; i < 3; i++) {
          const seaweedX = (width / 4) * (i + 1)
          const seaweedHeight = height * 0.8
          
          ctx.save()
          ctx.strokeStyle = '#2E8B57'
          ctx.lineWidth = 8
          ctx.lineCap = 'round'
          
          ctx.beginPath()
          ctx.moveTo(seaweedX, height)
          
          for (let j = 0; j < 20; j++) {
            const segmentY = height - (j / 20) * seaweedHeight
            const sway = Math.sin(this.time + i + j * 0.2) * 15
            ctx.lineTo(seaweedX + sway, segmentY)
          }
          
          ctx.stroke()
          ctx.restore()
        }
        
        // Add floating particles (marine snow)
        for (let i = 0; i < 30; i++) {
          const particleX = (Math.sin(this.time + i) * width + width) % width
          const particleY = (Math.cos(this.time * 0.7 + i) * height + height) % height
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.beginPath()
          ctx.arc(particleX, particleY, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } catch (error) {
      console.error('Underwater background filter error:', error)
    }
  }
}