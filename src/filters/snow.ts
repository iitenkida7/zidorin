import { Filter } from '../types/filter'

export class SnowFilter implements Filter {
  id = 'snow' as const
  name = '雪景色'
  icon = '❄️'
  category = 'decorate' as const
  private snowflakes: Array<{ x: number; y: number; vx: number; vy: number; size: number; rotation: number; rotationSpeed: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add new snowflakes
    if (Math.random() > 0.88) {
      for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
        this.snowflakes.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 1 + 0.5,
          size: Math.random() * 6 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4
        })
      }
    }
    
    // Update and draw snowflakes
    this.snowflakes = this.snowflakes.filter(flake => {
      flake.x += flake.vx + Math.sin(flake.y * 0.01) * 0.3 // gentle drift
      flake.y += flake.vy
      flake.rotation += flake.rotationSpeed
      
      if (flake.y < height + 20) {
        ctx.save()
        ctx.translate(flake.x, flake.y)
        ctx.rotate((flake.rotation * Math.PI) / 180)
        ctx.globalAlpha = 0.8
        
        // Draw snowflake
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1
        ctx.lineCap = 'round'
        
        const size = flake.size
        
        // Draw 6 main arms
        for (let i = 0; i < 6; i++) {
          ctx.save()
          ctx.rotate((i * 60 * Math.PI) / 180)
          
          // Main arm
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, -size)
          ctx.stroke()
          
          // Side branches
          ctx.beginPath()
          ctx.moveTo(0, -size * 0.6)
          ctx.lineTo(-size * 0.3, -size * 0.8)
          ctx.moveTo(0, -size * 0.6)
          ctx.lineTo(size * 0.3, -size * 0.8)
          ctx.stroke()
          
          ctx.restore()
        }
        
        // Add center dot
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        return true
      }
      return false
    })
  }
}