import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'

export class EyesEmojiFilter implements Filter {
  id = 'eyesemoji' as const
  name = '目が👀'
  icon = '👀'
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
        
        // 左目と右目の位置を取得
        const leftEye = keypoints.find((p: any) => p.name === 'leftEye')
        const rightEye = keypoints.find((p: any) => p.name === 'rightEye')
        
        if (leftEye && rightEye) {
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
          )
          const eyeSize = eyeDistance * 0.6
          
          // 左目の👀
          ctx.save()
          ctx.font = `${eyeSize}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          // 元の目の部分を隠す
          ctx.fillStyle = 'rgba(255, 218, 185, 0.9)'
          ctx.beginPath()
          ctx.arc(leftEye.x, leftEye.y, eyeSize / 2, 0, Math.PI * 2)
          ctx.fill()
          
          // 👀絵文字を描画
          ctx.fillText('👁', leftEye.x, leftEye.y)
          
          // 右目の👀
          ctx.fillStyle = 'rgba(255, 218, 185, 0.9)'
          ctx.beginPath()
          ctx.arc(rightEye.x, rightEye.y, eyeSize / 2, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.fillText('👁', rightEye.x, rightEye.y)
          ctx.restore()
        }
      }
    } catch (error) {
      console.error('Face detection failed:', error)
    }
  }
}