import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class MagicCircleFilter implements Filter {
  id = 'magiccircle' as const
  name = '魔法陣'
  icon = '✨'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private rotation = 0
  private pulseTime = 0
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    this.rotation += 1
    this.pulseTime += 0.05
    
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
          
          // Calculate magic circle position (around face)
          const centerX = xMin + faceWidth / 2
          const centerY = yMin + faceHeight / 2
          const radius = Math.max(faceWidth, faceHeight) * 0.8
          
          ctx.save()
          
          const pulse = Math.sin(this.pulseTime) * 0.3 + 0.7
          const alpha = pulse * 0.8
          
          // Draw outer magic circle
          ctx.translate(centerX, centerY)
          ctx.rotate((this.rotation * Math.PI) / 180)
          ctx.globalAlpha = alpha
          
          // Main circle
          ctx.strokeStyle = '#9400D3'
          ctx.lineWidth = 3
          ctx.setLineDash([10, 5])
          ctx.beginPath()
          ctx.arc(0, 0, radius, 0, Math.PI * 2)
          ctx.stroke()
          
          // Inner circles
          ctx.setLineDash([5, 3])
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2)
          ctx.stroke()
          
          ctx.beginPath()
          ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2)
          ctx.stroke()
          
          // Reset line dash
          ctx.setLineDash([])
          
          // Draw magical symbols around the circle
          const symbols = ['★', '◆', '▲', '●', '■', '♦', '◊', '※']
          symbols.forEach((symbol, index) => {
            const angle = (index / symbols.length) * Math.PI * 2
            const symbolX = Math.cos(angle) * radius * 1.2
            const symbolY = Math.sin(angle) * radius * 1.2
            
            ctx.save()
            ctx.translate(symbolX, symbolY)
            ctx.rotate(-this.rotation * Math.PI / 180) // Counter-rotate text
            ctx.fillStyle = '#9400D3'
            ctx.font = 'bold 16px serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(symbol, 0, 0)
            ctx.restore()
          })
          
          // Draw intersecting lines
          ctx.strokeStyle = '#8A2BE2'
          ctx.lineWidth = 1
          ctx.globalAlpha = alpha * 0.6
          
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            ctx.beginPath()
            ctx.moveTo(Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3)
            ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9)
            ctx.stroke()
          }
          
          // Draw center symbol that rotates opposite direction
          ctx.save()
          ctx.rotate((-this.rotation * 2 * Math.PI) / 180)
          ctx.fillStyle = '#9400D3'
          ctx.globalAlpha = alpha
          
          // Draw pentagram
          const starRadius = radius * 0.15
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
            const x = Math.cos(angle) * starRadius
            const y = Math.sin(angle) * starRadius
            
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.closePath()
          ctx.fill()
          
          ctx.restore()
          
          // Add magical particles
          for (let i = 0; i < 12; i++) {
            const particleAngle = (i / 12) * Math.PI * 2 + this.rotation * 0.02
            const particleRadius = radius * (0.5 + Math.sin(this.pulseTime + i) * 0.3)
            const particleX = Math.cos(particleAngle) * particleRadius
            const particleY = Math.sin(particleAngle) * particleRadius
            
            ctx.fillStyle = '#FF69B4'
            ctx.globalAlpha = Math.sin(this.pulseTime * 2 + i) * 0.5 + 0.5
            ctx.beginPath()
            ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
            ctx.fill()
          }
          
          ctx.restore()
        }
      })
    } catch (error) {
      console.error('Magic circle filter error:', error)
    }
  }
}