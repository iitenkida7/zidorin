import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import { Face, FaceDetector } from '../types/tensorflow'

export class AgeGenderFilter implements Filter {
  id = 'agegender' as const
  name = '年齢・性別'
  icon = '🧠'
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private estimationHistory: Array<{age: number, gender: string}> = []
  
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
      
      if (faces && faces.length > 0) {
        const face = faces[0]
        const keypoints = face.keypoints
        
        // 簡易的な年齢・性別推定（実際のAI推定ではなく、顔の特徴から推測）
        const estimation = this.estimateAgeGender(keypoints, imageData, width, height)
        
        // 履歴を使って安定化
        this.estimationHistory.push(estimation)
        if (this.estimationHistory.length > 10) {
          this.estimationHistory.shift()
        }
        
        const averageAge = Math.round(
          this.estimationHistory.reduce((sum, est) => sum + est.age, 0) / this.estimationHistory.length
        )
        
        const genderCounts = this.estimationHistory.reduce((counts, est) => {
          counts[est.gender] = (counts[est.gender] || 0) + 1
          return counts
        }, {} as Record<string, number>)
        
        const dominantGender = Object.keys(genderCounts).reduce((a, b) => 
          genderCounts[a] > genderCounts[b] ? a : b
        )
        
        // 顔の境界ボックスを計算
        const minX = Math.min(...keypoints.map(p => p.x))
        const maxX = Math.max(...keypoints.map(p => p.x))
        const minY = Math.min(...keypoints.map(p => p.y))
        // const _maxY = Math.max(...keypoints.map(p => p.y))
        
        // 結果を描画
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(minX, minY - 60, maxX - minX, 50)
        
        ctx.fillStyle = 'white'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        
        const genderEmoji = dominantGender === 'male' ? '👨' : '👩'
        const text = `${genderEmoji} ${averageAge}歳 ${dominantGender === 'male' ? '男性' : '女性'}`
        
        ctx.fillText(text, (minX + maxX) / 2, minY - 30)
        ctx.restore()
      }
    } catch (error) {
      console.error('Face detection failed:', error)
    }
  }
  
  private estimateAgeGender(keypoints: Face['keypoints'], _imageData: ImageData, _width: number, _height: number): {age: number, gender: string} {
    // 簡易的な推定ロジック（実際のAIモデルの代替）
    
    // 顔の特徴点から基本的な測定値を計算
    const leftEye = keypoints.find(p => p.name === 'leftEye')
    const rightEye = keypoints.find(p => p.name === 'rightEye')
    const noseTip = keypoints.find(p => p.name === 'noseTip')
    const leftMouth = keypoints.find(p => p.name === 'leftMouth')
    const rightMouth = keypoints.find(p => p.name === 'rightMouth')
    
    if (!leftEye || !rightEye || !noseTip || !leftMouth || !rightMouth) {
      return { age: 25, gender: 'female' }
    }
    
    // 目と口の距離
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
    )
    const mouthDistance = Math.sqrt(
      Math.pow(rightMouth.x - leftMouth.x, 2) + Math.pow(rightMouth.y - leftMouth.y, 2)
    )
    
    // 顔の縦横比
    const faceHeight = Math.abs(noseTip.y - leftEye.y) * 2
    const faceWidth = eyeDistance * 1.5
    const aspectRatio = faceHeight / faceWidth
    
    // 年齢推定（顔の特徴の鋭さと大きさから）
    const sharpnessRatio = mouthDistance / eyeDistance
    let estimatedAge = 20 + (aspectRatio - 1.2) * 30 + (sharpnessRatio - 0.6) * 20
    estimatedAge = Math.max(15, Math.min(65, estimatedAge)) + Math.random() * 10 - 5
    
    // 性別推定（統計的な顔の特徴から）
    const genderScore = aspectRatio + sharpnessRatio * 0.5
    const gender = genderScore > 1.4 ? 'male' : 'female'
    
    return {
      age: Math.round(estimatedAge),
      gender
    }
  }
}