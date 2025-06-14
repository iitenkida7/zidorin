import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class RobotEyesFilter implements Filter {
  id = 'roboteyes' as const
  name = 'ロボットアイ'
  icon = '🤖'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private scanLine = 0
  
  async apply(ctx: CanvasRenderingContext2D, _width: number, _height: number): Promise<void> {
    this.scanLine += 3
    
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
        if (face.keypoints) {
          // Find eye positions (using array indices)
          const leftEye = face.keypoints[0] // Left eye
          const rightEye = face.keypoints[1] // Right eye
          
          if (leftEye && rightEye) {
            [leftEye, rightEye].forEach(eye => {
              const eyeSize = 25
              
              ctx.save()
              
              // Draw robot eye base
              ctx.fillStyle = '#2C3E50'
              ctx.beginPath()
              ctx.arc(eye.x, eye.y, eyeSize, 0, Math.PI * 2)
              ctx.fill()
              
              // Draw metallic ring
              ctx.strokeStyle = '#BDC3C7'
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.arc(eye.x, eye.y, eyeSize, 0, Math.PI * 2)
              ctx.stroke()
              
              // Draw inner LED circle
              ctx.fillStyle = '#E74C3C'
              ctx.beginPath()
              ctx.arc(eye.x, eye.y, eyeSize * 0.6, 0, Math.PI * 2)
              ctx.fill()
              
              // Draw scanning line effect
              const scanY = eye.y - eyeSize + ((this.scanLine % (eyeSize * 2)))
              if (scanY >= eye.y - eyeSize && scanY <= eye.y + eyeSize) {
                ctx.strokeStyle = '#FF6B6B'
                ctx.lineWidth = 2
                ctx.globalAlpha = 0.8
                ctx.beginPath()
                ctx.moveTo(eye.x - eyeSize * 0.6, scanY)
                ctx.lineTo(eye.x + eyeSize * 0.6, scanY)
                ctx.stroke()
              }
              
              // Draw center dot
              ctx.fillStyle = '#FFFFFF'
              ctx.beginPath()
              ctx.arc(eye.x, eye.y, eyeSize * 0.2, 0, Math.PI * 2)
              ctx.fill()
              
              // Draw HUD elements
              ctx.strokeStyle = '#00FF00'
              ctx.lineWidth = 1
              ctx.globalAlpha = 0.6
              
              // Crosshairs
              ctx.beginPath()
              ctx.moveTo(eye.x - eyeSize * 1.5, eye.y)
              ctx.lineTo(eye.x - eyeSize * 1.2, eye.y)
              ctx.moveTo(eye.x + eyeSize * 1.2, eye.y)
              ctx.lineTo(eye.x + eyeSize * 1.5, eye.y)
              ctx.moveTo(eye.x, eye.y - eyeSize * 1.5)
              ctx.lineTo(eye.x, eye.y - eyeSize * 1.2)
              ctx.moveTo(eye.x, eye.y + eyeSize * 1.2)
              ctx.lineTo(eye.x, eye.y + eyeSize * 1.5)
              ctx.stroke()
              
              ctx.restore()
            })
          }
        }
      })
    } catch (error) {
      console.error('Robot eyes filter error:', error)
    }
  }
}