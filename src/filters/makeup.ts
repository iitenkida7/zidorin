import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class MakeupFilter implements Filter {
  id = 'makeup' as const
  name = 'メイクアップ'
  icon = '💄'
  category = 'face' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
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
    
    // 美肌効果を先に適用
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // ソフトフォーカス効果で美肌に
    for (let i = 0; i < data.length; i += 4) {
      // 肌色に近い色をより明るく滑らかに
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      if (r > 100 && g > 80 && b > 70 && r > b) {
        data[i] = Math.min(255, r + 15)
        data[i + 1] = Math.min(255, g + 12)
        data[i + 2] = Math.min(255, b + 10)
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    const video = document.createElement('canvas')
    video.width = width
    video.height = height
    const videoCtx = video.getContext('2d')!
    videoCtx.drawImage(ctx.canvas, 0, 0)
    
    try {
      const faces = await this.faceDetector.estimateFaces(video)
      
      if (faces && faces.length > 0) {
        const face = faces[0]
        const keypoints = face.keypoints
        
        if (keypoints && keypoints.length > 0) {
          // MediaPipe Face Meshのkeypoint indices
          const leftEye = keypoints[33]   // 左目
          const rightEye = keypoints[263] // 右目
          const noseTip = keypoints[1]    // 鼻先
          const leftMouth = keypoints[61] // 口の左端
          const rightMouth = keypoints[291] // 口の右端
          
          console.log('Makeup filter - keypoints found:', { leftEye, rightEye, noseTip, leftMouth, rightMouth })
        
        if (leftEye && rightEye && noseTip && leftMouth && rightMouth) {
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
          )
          
          // アイシャドウ
          ctx.save()
          ctx.globalAlpha = 0.3
          
          // 左目のアイシャドウ
          const leftGradient = ctx.createRadialGradient(
            leftEye.x, leftEye.y - eyeDistance * 0.1, 0,
            leftEye.x, leftEye.y - eyeDistance * 0.1, eyeDistance * 0.4
          )
          leftGradient.addColorStop(0, 'rgba(147, 112, 219, 0.6)')
          leftGradient.addColorStop(1, 'rgba(147, 112, 219, 0)')
          ctx.fillStyle = leftGradient
          ctx.fillRect(
            leftEye.x - eyeDistance * 0.4,
            leftEye.y - eyeDistance * 0.5,
            eyeDistance * 0.8,
            eyeDistance * 0.6
          )
          
          // 右目のアイシャドウ
          const rightGradient = ctx.createRadialGradient(
            rightEye.x, rightEye.y - eyeDistance * 0.1, 0,
            rightEye.x, rightEye.y - eyeDistance * 0.1, eyeDistance * 0.4
          )
          rightGradient.addColorStop(0, 'rgba(147, 112, 219, 0.6)')
          rightGradient.addColorStop(1, 'rgba(147, 112, 219, 0)')
          ctx.fillStyle = rightGradient
          ctx.fillRect(
            rightEye.x - eyeDistance * 0.4,
            rightEye.y - eyeDistance * 0.5,
            eyeDistance * 0.8,
            eyeDistance * 0.6
          )
          
          // チーク
          ctx.globalAlpha = 0.3
          const leftCheekX = leftEye.x
          const leftCheekY = noseTip.y
          const cheekGradient = ctx.createRadialGradient(
            leftCheekX, leftCheekY, 0,
            leftCheekX, leftCheekY, eyeDistance * 0.5
          )
          cheekGradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)')
          cheekGradient.addColorStop(1, 'rgba(255, 182, 193, 0)')
          ctx.fillStyle = cheekGradient
          ctx.fillRect(
            leftCheekX - eyeDistance * 0.5,
            leftCheekY - eyeDistance * 0.3,
            eyeDistance,
            eyeDistance * 0.6
          )
          
          const rightCheekX = rightEye.x
          const rightCheekGradient = ctx.createRadialGradient(
            rightCheekX, leftCheekY, 0,
            rightCheekX, leftCheekY, eyeDistance * 0.5
          )
          rightCheekGradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)')
          rightCheekGradient.addColorStop(1, 'rgba(255, 182, 193, 0)')
          ctx.fillStyle = rightCheekGradient
          ctx.fillRect(
            rightCheekX - eyeDistance * 0.5,
            leftCheekY - eyeDistance * 0.3,
            eyeDistance,
            eyeDistance * 0.6
          )
          
          // 口紅
          ctx.globalAlpha = 0.5
          const mouthCenterX = (leftMouth.x + rightMouth.x) / 2
          const mouthCenterY = (leftMouth.y + rightMouth.y) / 2
          const mouthWidth = Math.abs(rightMouth.x - leftMouth.x)
          
          ctx.fillStyle = 'rgba(220, 20, 60, 0.6)'
          ctx.beginPath()
          ctx.ellipse(
            mouthCenterX,
            mouthCenterY,
            mouthWidth / 2,
            eyeDistance * 0.15,
            0, 0, Math.PI * 2
          )
          ctx.fill()
          
          ctx.restore()
          }
        }
      }
    } catch (error) {
      console.error('Face detection failed:', error)
    }
  }
}