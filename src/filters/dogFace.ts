import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'

export class DogFaceFilter implements Filter {
  id = 'dogface' as const
  name = '犬顔'
  icon = '🐶'
  private faceDetector: any = null
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
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const video = document.createElement('canvas')
    video.width = width
    video.height = height
    const videoCtx = video.getContext('2d')!
    videoCtx.putImageData(imageData, 0, 0)
    
    try {
      const faces = await this.faceDetector.estimateFaces(video)
      
      if (faces.length > 0) {
        const face = faces[0]
        const keypoints = face.keypoints
        
        // 顔の中心と大きさを計算
        const leftEye = keypoints.find((p: any) => p.name === 'leftEye')
        const rightEye = keypoints.find((p: any) => p.name === 'rightEye')
        const noseTip = keypoints.find((p: any) => p.name === 'noseTip')
        
        if (leftEye && rightEye && noseTip) {
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
          )
          
          const centerX = (leftEye.x + rightEye.x) / 2
          const centerY = noseTip.y - eyeDistance * 0.5
          const size = eyeDistance * 2.5
          
          // 顔を隠すために元の画像をぼかす
          ctx.filter = 'blur(20px)'
          ctx.drawImage(
            ctx.canvas,
            centerX - size / 2,
            centerY - size / 2,
            size,
            size,
            centerX - size / 2,
            centerY - size / 2,
            size,
            size
          )
          ctx.filter = 'none'
          
          // 犬の絵文字を描画
          ctx.save()
          ctx.font = `${size}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🐶', centerX, centerY)
          ctx.restore()
        }
      }
    } catch (error) {
      console.error('Face detection failed:', error)
    }
  }
}