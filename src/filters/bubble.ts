import { Filter } from '../types/filter'

export class BubbleFilter implements Filter {
  id = 'bubble' as const
  name = 'しゃぼん玉'
  icon = '🫧'
  category = 'decorate' as const
  private bubbles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add new bubbles
    if (Math.random() > 0.9) {
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        this.bubbles.push({
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 2 + 1),
          size: Math.random() * 30 + 10,
          opacity: Math.random() * 0.8 + 0.2,
          life: 1.0
        })
      }
    }
    
    // Update and draw bubbles
    this.bubbles = this.bubbles.filter(bubble => {
      bubble.x += bubble.vx
      bubble.y += bubble.vy
      bubble.vx *= 0.99 // air resistance
      bubble.vy += 0.01 // slight upward buoyancy
      bubble.life -= 0.005
      bubble.opacity = bubble.life * 0.6
      
      if (bubble.life > 0 && bubble.y > -50) {
        ctx.save()
        ctx.globalAlpha = bubble.opacity
        
        // Draw bubble with gradient
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.size * 0.3, 
          bubble.y - bubble.size * 0.3, 
          0,
          bubble.x, 
          bubble.y, 
          bubble.size
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
        gradient.addColorStop(0.3, 'rgba(200, 230, 255, 0.4)')
        gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.2)')
        gradient.addColorStop(1, 'rgba(100, 150, 255, 0.1)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.beginPath()
        ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.2, 0, Math.PI * 2)
        ctx.fill()
        
        // Add border
        ctx.strokeStyle = 'rgba(200, 230, 255, 0.8)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        ctx.stroke()
        
        ctx.restore()
        return true
      }
      return false
    })
  }
}