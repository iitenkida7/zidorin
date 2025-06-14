import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class DogFaceFilter implements Filter {
  id = 'dogface' as const
  name = '犬顔'
  icon = '🐶'
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    console.log('DogFace filter apply called')
    
    if (this.isLoading) {
      console.log('Face detector is loading...')
      return
    }
    
    if (!this.faceDetector) {
      console.log('Loading face detector...')
      this.isLoading = true
      try {
        this.faceDetector = await modelLoader.getFaceDetector()
        console.log('Face detector loaded successfully')
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
      console.log('Estimating faces...')
      const faces = await this.faceDetector.estimateFaces(video)
      console.log(`Found ${faces?.length || 0} faces`)
      
      if (faces && faces.length > 0) {
        const face = faces[0]
        console.log('Face keypoints:', face.keypoints?.length || 0)
        
        // MediaPipe Face Meshの場合、keypointsは数値インデックスでアクセス
        const keypoints = face.keypoints
        if (keypoints && keypoints.length > 0) {
          // 左目: index 33, 右目: index 263, 鼻先: index 1
          const leftEye = keypoints[33]
          const rightEye = keypoints[263] 
          const noseTip = keypoints[1]
          
          console.log('Keypoints found:', { leftEye, rightEye, noseTip })
          
          if (leftEye && rightEye && noseTip) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            
            const centerX = (leftEye.x + rightEye.x) / 2
            const centerY = (leftEye.y + rightEye.y) / 2
            const size = eyeDistance * 3.5
            
            console.log('Drawing dog face at:', { centerX, centerY, size })
            
            // 背景色を描画（透過を防ぐため）
            ctx.save()
            ctx.fillStyle = '#FFFFFF'
            ctx.beginPath()
            ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI)
            ctx.fill()
            ctx.restore()
            
            // 犬の絵文字を描画
            ctx.save()
            ctx.font = `${size}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('🐶', centerX, centerY)
            ctx.restore()
          }
        }
      }
    } catch (error) {
      console.error('Face detection failed:', error)
    }
  }
}