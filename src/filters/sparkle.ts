import { Filter } from '../types/filter'

export class SparkleFilter implements Filter {
  id = 'sparkle' as const
  name = 'キラキラ'
  icon = '✨'
  private sparkles: Array<{ x: number; y: number; size: number; opacity: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (Math.random() > 0.7) {
      this.sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 20 + 10,
        opacity: 1
      })
    }
    
    this.sparkles = this.sparkles.filter(sparkle => sparkle.opacity > 0)
    
    this.sparkles.forEach(sparkle => {
      ctx.save()
      ctx.globalAlpha = sparkle.opacity
      
      const gradient = ctx.createRadialGradient(
        sparkle.x, sparkle.y, 0,
        sparkle.x, sparkle.y, sparkle.size
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      gradient.addColorStop(0.5, 'rgba(255, 223, 186, 0.8)')
      gradient.addColorStop(1, 'rgba(255, 223, 186, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(
        sparkle.x - sparkle.size,
        sparkle.y - sparkle.size,
        sparkle.size * 2,
        sparkle.size * 2
      )
      
      this.drawStar(ctx, sparkle.x, sparkle.y, sparkle.size / 2, 4, 0.5)
      
      ctx.restore()
      
      sparkle.opacity -= 0.02
    })
  }
  
  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerRadius: number,
    spikes: number,
    innerRadius: number
  ): void {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes
    
    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step
      
      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fill()
  }
}