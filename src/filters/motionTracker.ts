import { Filter } from '../types/filter'

export class MotionTrackerFilter implements Filter {
  id = 'motiontracker' as const
  name = 'モーション解析'
  icon = '🎯'
  category = 'special' as const
  private previousFrame: ImageData | null = null
  private motionVectors: Array<{ x: number; y: number; vx: number; vy: number; intensity: number; age: number }> = []
  private motionHistory: Array<{ x: number; y: number; time: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const currentFrame = ctx.getImageData(0, 0, width, height)
    
    if (this.previousFrame) {
      this.detectMotion(currentFrame, this.previousFrame, width, height)
    }
    
    this.previousFrame = currentFrame
    this.updateMotionVectors()
    this.drawMotionAnalysis(ctx, width, height)
  }
  
  private detectMotion(current: ImageData, previous: ImageData, width: number, height: number): void {
    const currentData = current.data
    const previousData = previous.data
    const blockSize = 16 // Analyze in 16x16 blocks for performance
    
    for (let y = 0; y < height - blockSize; y += blockSize) {
      for (let x = 0; x < width - blockSize; x += blockSize) {
        let totalDiff = 0
        let motionX = 0
        let motionY = 0
        
        // Calculate motion in this block
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4
            
            const diffR = currentData[idx] - previousData[idx]
            const diffG = currentData[idx + 1] - previousData[idx + 1]
            const diffB = currentData[idx + 2] - previousData[idx + 2]
            
            const pixelDiff = Math.abs(diffR) + Math.abs(diffG) + Math.abs(diffB)
            totalDiff += pixelDiff
            
            // Approximate motion direction based on color gradients
            if (pixelDiff > 30) {
              motionX += diffR > 0 ? 1 : -1
              motionY += diffG > 0 ? 1 : -1
            }
          }
        }
        
        const avgDiff = totalDiff / (blockSize * blockSize)
        
        if (avgDiff > 20) { // Motion threshold
          const intensity = Math.min(1, avgDiff / 100)
          
          this.motionVectors.push({
            x: x + blockSize / 2,
            y: y + blockSize / 2,
            vx: motionX * 0.1,
            vy: motionY * 0.1,
            intensity: intensity,
            age: 0
          })
          
          this.motionHistory.push({
            x: x + blockSize / 2,
            y: y + blockSize / 2,
            time: Date.now()
          })
        }
      }
    }
    
    // Clean up old history
    const now = Date.now()
    this.motionHistory = this.motionHistory.filter(point => now - point.time < 2000)
  }
  
  private updateMotionVectors(): void {
    this.motionVectors = this.motionVectors.filter(vector => {
      vector.age++
      vector.intensity *= 0.95 // Fade over time
      return vector.age < 30 && vector.intensity > 0.1
    })
  }
  
  private drawMotionAnalysis(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save()
    
    // Draw motion vectors
    this.motionVectors.forEach(vector => {
      const alpha = vector.intensity
      
      ctx.save()
      ctx.globalAlpha = alpha
      
      // Motion vector arrow
      ctx.strokeStyle = `hsl(${(1 - vector.intensity) * 120}, 100%, 50%)` // Red for high motion, green for low
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      
      const endX = vector.x + vector.vx * 20
      const endY = vector.y + vector.vy * 20
      
      // Arrow line
      ctx.beginPath()
      ctx.moveTo(vector.x, vector.y)
      ctx.lineTo(endX, endY)
      ctx.stroke()
      
      // Arrow head
      const angle = Math.atan2(vector.vy, vector.vx)
      const headLength = 8
      
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6)
      )
      ctx.moveTo(endX, endY)
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6)
      )
      ctx.stroke()
      
      // Motion intensity circle
      ctx.fillStyle = `hsla(${(1 - vector.intensity) * 120}, 100%, 50%, 0.3)`
      ctx.beginPath()
      ctx.arc(vector.x, vector.y, vector.intensity * 10, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    })
    
    // Draw motion trails
    if (this.motionHistory.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      
      this.motionHistory.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      
      ctx.stroke()
      
      // Draw trail points
      this.motionHistory.forEach(point => {
        const age = (Date.now() - point.time) / 2000
        const alpha = Math.max(0, 1 - age)
        
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }
    
    // Draw motion analysis HUD
    this.drawMotionHUD(ctx, width, height)
    
    ctx.restore()
  }
  
  private drawMotionHUD(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const hudX = 20
    const hudY = 20
    const hudWidth = 200
    const hudHeight = 120
    
    // HUD background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(hudX, hudY, hudWidth, hudHeight)
    
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 2
    ctx.strokeRect(hudX, hudY, hudWidth, hudHeight)
    
    // Title
    ctx.fillStyle = '#00FF00'
    ctx.font = 'bold 14px Courier'
    ctx.textAlign = 'left'
    ctx.fillText('MOTION TRACKER', hudX + 10, hudY + 20)
    
    // Motion statistics
    const totalMotion = this.motionVectors.reduce((sum, v) => sum + v.intensity, 0)
    const avgMotion = this.motionVectors.length > 0 ? totalMotion / this.motionVectors.length : 0
    const maxMotion = this.motionVectors.reduce((max, v) => Math.max(max, v.intensity), 0)
    
    ctx.font = '10px Courier'
    ctx.fillText(`Active Vectors: ${this.motionVectors.length}`, hudX + 10, hudY + 40)
    ctx.fillText(`Avg Motion: ${(avgMotion * 100).toFixed(1)}%`, hudX + 10, hudY + 55)
    ctx.fillText(`Max Motion: ${(maxMotion * 100).toFixed(1)}%`, hudX + 10, hudY + 70)
    ctx.fillText(`History Points: ${this.motionHistory.length}`, hudX + 10, hudY + 85)
    
    // Motion level bar
    const barX = hudX + 10
    const barY = hudY + 95
    const barWidth = hudWidth - 20
    const barHeight = 10
    
    ctx.fillStyle = '#333333'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    const motionLevel = Math.min(1, avgMotion)
    const barFillWidth = barWidth * motionLevel
    
    ctx.fillStyle = `hsl(${(1 - motionLevel) * 120}, 100%, 50%)`
    ctx.fillRect(barX, barY, barFillWidth, barHeight)
    
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barWidth, barHeight)
    
    // Motion compass (shows primary motion direction)
    const compassX = hudX + hudWidth - 40
    const compassY = hudY + 60
    const compassRadius = 20
    
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
    ctx.stroke()
    
    // Calculate average motion direction
    let avgVx = 0, avgVy = 0
    this.motionVectors.forEach(v => {
      avgVx += v.vx * v.intensity
      avgVy += v.vy * v.intensity
    })
    
    if (this.motionVectors.length > 0) {
      avgVx /= this.motionVectors.length
      avgVy /= this.motionVectors.length
      
      const magnitude = Math.sqrt(avgVx * avgVx + avgVy * avgVy)
      if (magnitude > 0.1) {
        const endX = compassX + (avgVx / magnitude) * compassRadius * 0.8
        const endY = compassY + (avgVy / magnitude) * compassRadius * 0.8
        
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(compassX, compassY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }
  }
}