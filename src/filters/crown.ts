import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class CrownFilter implements Filter {
  id = 'crown' as const
  name = '王冠'
  icon = '👑'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private sparkleTime = 0
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    this.sparkleTime += 0.1
    
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
          const { xMin, yMin, width: faceWidth } = face.box
          
          // Calculate crown position
          const crownX = xMin + faceWidth / 2
          const crownY = yMin - faceWidth * 0.3
          const crownWidth = faceWidth * 0.8
          const crownHeight = faceWidth * 0.4
          
          ctx.save()
          
          // Draw crown base
          const gradient = ctx.createLinearGradient(
            crownX - crownWidth / 2, crownY,
            crownX + crownWidth / 2, crownY + crownHeight
          )
          gradient.addColorStop(0, '#FFD700')
          gradient.addColorStop(0.5, '#FFA500')
          gradient.addColorStop(1, '#FF8C00')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          
          // Crown shape with points
          const points = 5
          const baseY = crownY + crownHeight * 0.7
          const pointHeight = crownHeight * 0.6
          
          ctx.moveTo(crownX - crownWidth / 2, baseY)
          
          for (let i = 0; i < points; i++) {
            const x = crownX - crownWidth / 2 + (crownWidth / (points - 1)) * i
            const isMainPoint = i === Math.floor(points / 2)
            const height = isMainPoint ? pointHeight * 1.3 : pointHeight
            
            ctx.lineTo(x, crownY + crownHeight - height)
            if (i < points - 1) {
              const nextX = crownX - crownWidth / 2 + (crownWidth / (points - 1)) * (i + 1)
              const midX = (x + nextX) / 2
              ctx.lineTo(midX, baseY - pointHeight * 0.2)
            }
          }
          
          ctx.lineTo(crownX + crownWidth / 2, baseY)
          ctx.lineTo(crownX + crownWidth / 2, crownY + crownHeight)
          ctx.lineTo(crownX - crownWidth / 2, crownY + crownHeight)
          ctx.closePath()
          ctx.fill()
          
          // Add crown band
          ctx.fillStyle = '#B8860B'
          ctx.fillRect(crownX - crownWidth / 2, baseY, crownWidth, crownHeight * 0.3)
          
          // Add jewels
          const jewels = [
            { x: crownX, y: crownY + crownHeight * 0.3, color: '#FF0000', size: 8 },
            { x: crownX - crownWidth * 0.25, y: crownY + crownHeight * 0.5, color: '#0000FF', size: 6 },
            { x: crownX + crownWidth * 0.25, y: crownY + crownHeight * 0.5, color: '#00FF00', size: 6 },
            { x: crownX - crownWidth * 0.4, y: crownY + crownHeight * 0.6, color: '#FF00FF', size: 4 },
            { x: crownX + crownWidth * 0.4, y: crownY + crownHeight * 0.6, color: '#FFFF00', size: 4 }
          ]
          
          jewels.forEach((jewel, index) => {
            const sparkle = Math.sin(this.sparkleTime + index) * 0.5 + 0.5
            
            ctx.save()
            ctx.globalAlpha = 0.8 + sparkle * 0.2
            
            // Jewel shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
            ctx.beginPath()
            ctx.arc(jewel.x + 1, jewel.y + 1, jewel.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Main jewel
            ctx.fillStyle = jewel.color
            ctx.beginPath()
            ctx.arc(jewel.x, jewel.y, jewel.size, 0, Math.PI * 2)
            ctx.fill()
            
            // Jewel highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
            ctx.beginPath()
            ctx.arc(jewel.x - jewel.size * 0.3, jewel.y - jewel.size * 0.3, jewel.size * 0.4, 0, Math.PI * 2)
            ctx.fill()
            
            ctx.restore()
          })
          
          // Add sparkles around crown
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.sparkleTime
            const distance = crownWidth * 0.6
            const sparkleX = crownX + Math.cos(angle) * distance
            const sparkleY = crownY + crownHeight * 0.5 + Math.sin(angle) * distance * 0.3
            
            ctx.save()
            ctx.globalAlpha = Math.sin(this.sparkleTime * 2 + i) * 0.5 + 0.5
            ctx.fillStyle = '#FFFFFF'
            ctx.translate(sparkleX, sparkleY)
            ctx.rotate(this.sparkleTime + i)
            
            // Draw 4-pointed star
            ctx.beginPath()
            ctx.moveTo(0, -4)
            ctx.lineTo(1, -1)
            ctx.lineTo(4, 0)
            ctx.lineTo(1, 1)
            ctx.lineTo(0, 4)
            ctx.lineTo(-1, 1)
            ctx.lineTo(-4, 0)
            ctx.lineTo(-1, -1)
            ctx.closePath()
            ctx.fill()
            
            ctx.restore()
          }
          
          ctx.restore()
        }
      })
    } catch (error) {
      console.error('Crown filter error:', error)
    }
  }
}