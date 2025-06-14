import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class AngelHaloFilter implements Filter {
  id = 'angelhalo' as const
  name = '天使の輪'
  icon = '😇'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private haloGlow = 0
  
  async apply(ctx: CanvasRenderingContext2D, _width: number, _height: number): Promise<void> {
    this.haloGlow += 0.1
    
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
          
          // Calculate halo position (above head)
          const haloX = xMin + faceWidth / 2
          const haloY = yMin - faceHeight * 0.1
          const haloRadius = faceWidth * 0.4
          
          ctx.save()
          
          // Draw glowing halo
          const glowIntensity = 0.5 + Math.sin(this.haloGlow) * 0.3
          
          // Outer glow
          const outerGradient = ctx.createRadialGradient(
            haloX, haloY, haloRadius * 0.8,
            haloX, haloY, haloRadius * 1.5
          )
          outerGradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity * 0.3})`)
          outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          
          ctx.fillStyle = outerGradient
          ctx.beginPath()
          ctx.arc(haloX, haloY, haloRadius * 1.5, 0, Math.PI * 2)
          ctx.fill()
          
          // Main halo ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity})`
          ctx.lineWidth = 8
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
          ctx.shadowBlur = 20
          ctx.beginPath()
          ctx.arc(haloX, haloY, haloRadius, 0, Math.PI * 2)
          ctx.stroke()
          
          // Inner highlight
          ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 1.2})`
          ctx.lineWidth = 3
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(haloX, haloY, haloRadius, 0, Math.PI * 2)
          ctx.stroke()
          
          ctx.restore()
        }
      })
    } catch (error) {
      console.error('Angel halo filter error:', error)
    }
  }
}