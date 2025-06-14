import { Filter } from '../types/filter'

export class SakuraFilter implements Filter {
  id = 'sakura' as const
  name = '桜吹雪'
  icon = '🌸'
  category = 'decorate' as const
  private petals: Array<{ x: number; y: number; vx: number; vy: number; rotation: number; size: number; opacity: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add new sakura petals
    if (Math.random() > 0.85) {
      for (let i = 0; i < 2; i++) {
        this.petals.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 1.5 + 0.5,
          rotation: Math.random() * 360,
          size: Math.random() * 12 + 8,
          opacity: Math.random() * 0.8 + 0.2
        })
      }
    }
    
    // Update and draw sakura petals
    this.petals = this.petals.filter(petal => {
      petal.x += petal.vx + Math.sin(petal.y * 0.01) * 0.5 // gentle swaying
      petal.y += petal.vy
      petal.rotation += 2
      petal.opacity -= 0.002
      
      if (petal.y < height + 20 && petal.opacity > 0) {
        ctx.save()
        ctx.globalAlpha = petal.opacity
        ctx.translate(petal.x, petal.y)
        ctx.rotate((petal.rotation * Math.PI) / 180)
        
        // Draw sakura petal shape
        ctx.fillStyle = '#FFB6C1'
        ctx.beginPath()
        
        // Create petal shape using bezier curves
        const size = petal.size
        ctx.moveTo(0, -size/2)
        ctx.quadraticCurveTo(size/3, -size/3, size/2, 0)
        ctx.quadraticCurveTo(size/3, size/3, 0, size/2)
        ctx.quadraticCurveTo(-size/3, size/3, -size/2, 0)
        ctx.quadraticCurveTo(-size/3, -size/3, 0, -size/2)
        ctx.closePath()
        ctx.fill()
        
        // Add inner gradient
        ctx.fillStyle = '#FF69B4'
        ctx.beginPath()
        ctx.arc(0, 0, size/4, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        return true
      }
      return false
    })
  }
}