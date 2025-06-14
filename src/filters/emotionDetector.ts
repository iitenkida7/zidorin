import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'
import type { FaceDetector } from '../types/tensorflow'

export class EmotionDetectorFilter implements Filter {
  id = 'emotion' as const
  name = '感情分析'
  icon = '😊'
  category = 'special' as const
  private faceDetector: FaceDetector | null = null
  private isLoading = false
  private detectedEmotions: Array<{ emotion: string; confidence: number; color: string; x: number; y: number; time: number }> = []
  
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
    
    try {
      const canvas = ctx.canvas
      const faces = await this.faceDetector.estimateFaces(canvas)
      
      // Clean up old emotions
      this.detectedEmotions = this.detectedEmotions.filter(emotion => Date.now() - emotion.time < 3000)
      
      faces.forEach(face => {
        if (face.box) {
          const { xMin, yMin, width: faceWidth, height: faceHeight } = face.box
          
          // Simple emotion detection based on face characteristics
          // This is a simplified version - in real app you'd use a proper emotion detection model
          const faceAspectRatio = faceWidth / faceHeight
          const emotion = this.analyzeEmotion(faceAspectRatio, faceWidth, faceHeight)
          
          this.detectedEmotions.push({
            emotion: emotion.name,
            confidence: emotion.confidence,
            color: emotion.color,
            x: xMin + faceWidth / 2,
            y: yMin - 30,
            time: Date.now()
          })
        }
      })
      
      // Draw emotion indicators
      this.detectedEmotions.forEach((emotion, index) => {
        const age = (Date.now() - emotion.time) / 3000
        const alpha = Math.max(0, 1 - age)
        const yOffset = age * 50 // Float upward
        
        ctx.save()
        ctx.globalAlpha = alpha
        
        // Emotion bubble background
        const textWidth = ctx.measureText(`${emotion.emotion} ${Math.round(emotion.confidence * 100)}%`).width
        const bubbleWidth = textWidth + 20
        const bubbleHeight = 30
        
        const gradient = ctx.createLinearGradient(
          emotion.x - bubbleWidth / 2, emotion.y - yOffset - bubbleHeight / 2,
          emotion.x + bubbleWidth / 2, emotion.y - yOffset + bubbleHeight / 2
        )
        gradient.addColorStop(0, emotion.color)
        gradient.addColorStop(1, `${emotion.color}AA`)
        
        ctx.fillStyle = gradient
        ctx.roundRect(
          emotion.x - bubbleWidth / 2,
          emotion.y - yOffset - bubbleHeight / 2,
          bubbleWidth,
          bubbleHeight,
          15
        )
        ctx.fill()
        
        // Emotion text
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          `${emotion.emotion} ${Math.round(emotion.confidence * 100)}%`,
          emotion.x,
          emotion.y - yOffset
        )
        
        // Emotion icon
        const icons = {
          '😊': '😊', '😢': '😢', '😮': '😮', '😠': '😠', 
          '😐': '😐', '😱': '😱', '🤔': '🤔'
        }
        const icon = icons[emotion.emotion as keyof typeof icons] || '😊'
        
        ctx.font = '20px Arial'
        ctx.fillText(icon, emotion.x - bubbleWidth / 2 + 15, emotion.y - yOffset)
        
        ctx.restore()
      })
      
      // Draw emotion radar chart in corner
      this.drawEmotionRadar(ctx, width, height)
      
    } catch (error) {
      console.error('Emotion detector filter error:', error)
    }
  }
  
  private analyzeEmotion(aspectRatio: number, width: number, height: number): { name: string; confidence: number; color: string } {
    // Simplified emotion detection based on face geometry
    // In a real implementation, you'd use a proper emotion detection model
    
    const emotions = [
      { name: '😊', confidence: 0.8, color: '#4CAF50' }, // Happy
      { name: '😢', confidence: 0.6, color: '#2196F3' }, // Sad
      { name: '😮', confidence: 0.7, color: '#FF9800' }, // Surprised
      { name: '😠', confidence: 0.5, color: '#F44336' }, // Angry
      { name: '😐', confidence: 0.9, color: '#9E9E9E' }, // Neutral
      { name: '😱', confidence: 0.3, color: '#9C27B0' }, // Fear
      { name: '🤔', confidence: 0.4, color: '#795548' }  // Thinking
    ]
    
    // Random selection for demo purposes
    // In real implementation, this would be based on actual facial feature analysis
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    return {
      ...randomEmotion,
      confidence: Math.random() * 0.5 + 0.5 // Random confidence 0.5-1.0
    }
  }
  
  private drawEmotionRadar(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const radarX = width - 120
    const radarY = height - 120
    const radarRadius = 50
    
    ctx.save()
    ctx.globalAlpha = 0.8
    
    // Radar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.beginPath()
    ctx.arc(radarX, radarY, radarRadius + 10, 0, Math.PI * 2)
    ctx.fill()
    
    // Radar circles
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 1
    for (let r = 10; r <= radarRadius; r += 10) {
      ctx.beginPath()
      ctx.arc(radarX, radarY, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    // Radar lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(radarX, radarY)
      ctx.lineTo(
        radarX + Math.cos(angle) * radarRadius,
        radarY + Math.sin(angle) * radarRadius
      )
      ctx.stroke()
    }
    
    // Emotion points
    const recentEmotions = this.detectedEmotions.slice(-5)
    recentEmotions.forEach((emotion, index) => {
      const angle = (index / 5) * Math.PI * 2
      const distance = emotion.confidence * radarRadius
      const x = radarX + Math.cos(angle) * distance
      const y = radarY + Math.sin(angle) * distance
      
      ctx.fillStyle = emotion.color
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
    
    ctx.restore()
  }
}