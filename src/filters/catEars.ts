import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class CatEarsFilter implements Filter {
  id = 'catears' as const
  name = 'ねこみみ'
  icon = '🐱'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private earTwitch = 0
  
  async apply(ctx: CanvasRenderingContext2D, _width: number, _height: number): Promise<void> {
    this.earTwitch += 0.05
    
    if (this.isLoading) return
    
    if (!this.faceDetector) {
      this.isLoading = true
      try {
        this.faceDetector = await modelLoader.getFaceDetector()
      } catch (error) {
        console.error('Face detector loading failed:', error)
        this.isLoading = false
        return
      }
      this.isLoading = false
    }
    
    try {
      const canvas = ctx.canvas
      const faces = await this.faceDetector.estimateFaces(canvas)
      
      faces.forEach(face => {
        if (face.box) {
          const { xMin, yMin, width: faceWidth, height: faceHeight } = face.box
          
          // Calculate ear positions
          const earSize = faceWidth * 0.2
          const leftEarX = xMin + faceWidth * 0.2
          const rightEarX = xMin + faceWidth * 0.8
          const earY = yMin - faceHeight * 0.1
          
          // Add slight animation
          const leftTwitch = Math.sin(this.earTwitch) * 3
          const rightTwitch = Math.sin(this.earTwitch + Math.PI) * 3
          
          ctx.save()
          
          // Draw left ear
          this.drawCatEar(ctx, leftEarX + leftTwitch, earY, earSize, -15)
          
          // Draw right ear
          this.drawCatEar(ctx, rightEarX + rightTwitch, earY, earSize, 15)
          
          ctx.restore()
        }
      })
    } catch (error) {
      console.error('Cat ears filter error:', error)
    }
  }
  
  private drawCatEar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number): void {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((angle * Math.PI) / 180)
    
    // Outer ear (black)
    ctx.fillStyle = '#FF69B4' // Pink
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-size * 0.6, -size * 1.2)
    ctx.lineTo(size * 0.6, -size * 1.2)
    ctx.closePath()
    ctx.fill()
    
    // Add gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, -size * 1.2)
    gradient.addColorStop(0, '#FF69B4')
    gradient.addColorStop(1, '#FF1493')
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Inner ear (pink)
    ctx.fillStyle = '#FFB6C1'
    ctx.beginPath()
    ctx.moveTo(0, -size * 0.2)
    ctx.lineTo(-size * 0.3, -size * 0.8)
    ctx.lineTo(size * 0.3, -size * 0.8)
    ctx.closePath()
    ctx.fill()
    
    // Ear outline
    ctx.strokeStyle = '#FF1493'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-size * 0.6, -size * 1.2)
    ctx.lineTo(size * 0.6, -size * 1.2)
    ctx.closePath()
    ctx.stroke()
    
    ctx.restore()
  }
}