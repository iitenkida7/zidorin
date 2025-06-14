import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { BodySegmenter } from '../types/tensorflow'

export class GalaxyBackgroundFilter implements Filter {
  id = 'galaxy' as const
  name = '銀河'
  icon = '🌌'
  category = 'background' as const
  private segmenter: BodySegmenter | null = null
  private isLoading = false
  private stars: Array<{ x: number; y: number; brightness: number; size: number; twinkle: number }> = []
  private time = 0
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    this.time += 0.02
    
    if (this.isLoading) return
    
    if (!this.segmenter) {
      this.isLoading = true
      try {
        this.segmenter = await modelLoader.getSegmenter()
      } catch (error) {
        console.error('Body segmenter loading failed:', error)
        this.isLoading = false
        return
      }
      this.isLoading = false
    }
    
    // Initialize stars if needed
    if (this.stars.length === 0) {
      for (let i = 0; i < 200; i++) {
        this.stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          brightness: Math.random(),
          size: Math.random() * 3 + 1,
          twinkle: Math.random() * Math.PI * 2
        })
      }
    }
    
    try {
      const canvas = ctx.canvas
      const segmentation = await this.segmenter!.segmentPeople(canvas)
      
      if (segmentation && segmentation.length > 0) {
        const mask = segmentation[0].mask
        const imageData = ctx.getImageData(0, 0, width, height)
        
        // Get mask data
        const maskData = mask.getUnderlyingCanvas ?
          mask.getUnderlyingCanvas().getContext('2d')!.getImageData(0, 0, width, height) :
          await mask.toImageData!()
        
        // Create galaxy background
        const backgroundData = ctx.createImageData(width, height)
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = y * width + x
            const pixelIndex = i * 4
            
            // Check if pixel is background (mask value is 0)
            const maskValue = maskData.data[pixelIndex] // Use red channel as mask
            if (maskValue < 128) { // Background pixel
              // Background pixel - draw galaxy
              const centerX = width / 2
              const centerY = height / 2
              const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
              const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
              const normalizedDistance = distanceFromCenter / maxDistance
              
              // Create spiral galaxy effect
              const angle = Math.atan2(y - centerY, x - centerX) + this.time
              const spiral = Math.sin(angle * 3 + normalizedDistance * 10 + this.time * 2) * 0.5 + 0.5
              
              // Galaxy colors (purple, blue, pink)
              const baseR = 20 + spiral * 50
              const baseG = 10 + spiral * 30
              const baseB = 40 + spiral * 80
              
              // Add some brightness variation
              const brightness = (1 - normalizedDistance * 0.7) * spiral
              
              backgroundData.data[pixelIndex] = baseR + brightness * 100
              backgroundData.data[pixelIndex + 1] = baseG + brightness * 50
              backgroundData.data[pixelIndex + 2] = baseB + brightness * 120
              backgroundData.data[pixelIndex + 3] = 255
            } else {
              // Person pixel - keep original
              backgroundData.data[pixelIndex] = imageData.data[pixelIndex]
              backgroundData.data[pixelIndex + 1] = imageData.data[pixelIndex + 1]
              backgroundData.data[pixelIndex + 2] = imageData.data[pixelIndex + 2]
              backgroundData.data[pixelIndex + 3] = imageData.data[pixelIndex + 3]
            }
          }
        }
        
        ctx.putImageData(backgroundData, 0, 0)
        
        // Add twinkling stars
        this.stars.forEach(star => {
          star.twinkle += 0.1
          const alpha = (Math.sin(star.twinkle) * 0.5 + 0.5) * star.brightness
          
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Add star glow
          ctx.globalAlpha = alpha * 0.3
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.restore()
        })
        
        // Add nebula clouds
        for (let i = 0; i < 5; i++) {
          const cloudX = (width / 6) * (i + 1) + Math.sin(this.time + i) * 50
          const cloudY = height / 2 + Math.cos(this.time * 0.7 + i) * 100
          const cloudSize = 80 + Math.sin(this.time + i) * 20
          
          const gradient = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudSize)
          gradient.addColorStop(0, 'rgba(255, 100, 200, 0.3)')
          gradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.2)')
          gradient.addColorStop(1, 'rgba(255, 100, 200, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } catch (error) {
      console.error('Galaxy background filter error:', error)
    }
  }
}