import { Filter } from '../types/filter'

export class ForestMagicFilter implements Filter {
  id = 'forestmagic' as const
  name = '魔法の森'
  icon = '🧚‍♀️'
  category = 'background' as const
  private time = 0
  private fireflies: Array<{ x: number; y: number; vx: number; vy: number; brightness: number; phase: number }> = []
  private trees: Array<{ x: number; width: number; height: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.time += 0.02
    
    // Initialize trees if needed
    if (this.trees.length === 0) {
      for (let i = 0; i < 8; i++) {
        this.trees.push({
          x: (width / 8) * i + Math.random() * 50,
          width: Math.random() * 40 + 30,
          height: Math.random() * height * 0.6 + height * 0.3
        })
      }
    }
    
    // Initialize fireflies if needed
    if (this.fireflies.length === 0) {
      for (let i = 0; i < 20; i++) {
        this.fireflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          brightness: Math.random(),
          phase: Math.random() * Math.PI * 2
        })
      }
    }
    
    // Draw magical forest background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#0D1B2A') // Dark night sky
    gradient.addColorStop(0.3, '#1B263B')
    gradient.addColorStop(0.7, '#415A77')
    gradient.addColorStop(1, '#1B2F3A') // Forest floor
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add magical mist
    for (let i = 0; i < 5; i++) {
      const mistX = ((this.time * 10 + i * 150) % (width + 200)) - 100
      const mistY = height * 0.6 + Math.sin(this.time + i) * 50
      const mistSize = 80 + Math.sin(this.time * 0.5 + i) * 20
      
      const mistGradient = ctx.createRadialGradient(mistX, mistY, 0, mistX, mistY, mistSize)
      mistGradient.addColorStop(0, 'rgba(200, 255, 200, 0.1)')
      mistGradient.addColorStop(0.5, 'rgba(150, 255, 150, 0.05)')
      mistGradient.addColorStop(1, 'rgba(100, 255, 100, 0)')
      
      ctx.fillStyle = mistGradient
      ctx.beginPath()
      ctx.arc(mistX, mistY, mistSize, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Draw tree silhouettes
    this.trees.forEach((tree, index) => {
      ctx.save()
      
      // Tree trunk
      const trunkGradient = ctx.createLinearGradient(tree.x, height - tree.height, tree.x + tree.width, height)
      trunkGradient.addColorStop(0, '#2C1810')
      trunkGradient.addColorStop(1, '#1A0F08')
      
      ctx.fillStyle = trunkGradient
      ctx.fillRect(tree.x, height - tree.height, tree.width, tree.height)
      
      // Tree canopy
      const canopyY = height - tree.height + tree.height * 0.3
      const canopySize = tree.width * 1.8
      
      const sway = Math.sin(this.time + index) * 5
      
      ctx.fillStyle = '#0A2F23'
      ctx.beginPath()
      ctx.arc(tree.x + tree.width / 2 + sway, canopyY, canopySize, 0, Math.PI * 2)
      ctx.fill()
      
      // Add magical glow to some trees
      if (index % 3 === 0) {
        ctx.save()
        ctx.globalAlpha = 0.3 + Math.sin(this.time * 2 + index) * 0.2
        
        const glowGradient = ctx.createRadialGradient(
          tree.x + tree.width / 2, canopyY, 0,
          tree.x + tree.width / 2, canopyY, canopySize * 1.5
        )
        glowGradient.addColorStop(0, 'rgba(100, 255, 100, 0.5)')
        glowGradient.addColorStop(1, 'rgba(100, 255, 100, 0)')
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(tree.x + tree.width / 2, canopyY, canopySize * 1.5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }
      
      ctx.restore()
    })
    
    // Update and draw fireflies
    this.fireflies.forEach(firefly => {
      firefly.x += firefly.vx
      firefly.y += firefly.vy
      firefly.phase += 0.05
      
      // Bounce off edges
      if (firefly.x < 0 || firefly.x > width) firefly.vx *= -1
      if (firefly.y < 0 || firefly.y > height) firefly.vy *= -1
      
      // Keep in bounds
      firefly.x = Math.max(0, Math.min(width, firefly.x))
      firefly.y = Math.max(0, Math.min(height, firefly.y))
      
      // Change direction occasionally
      if (Math.random() > 0.98) {
        firefly.vx = (Math.random() - 0.5) * 0.5
        firefly.vy = (Math.random() - 0.5) * 0.5
      }
      
      // Draw firefly
      const alpha = (Math.sin(firefly.phase) * 0.5 + 0.5) * firefly.brightness
      
      ctx.save()
      ctx.globalAlpha = alpha
      
      // Firefly glow
      const glowSize = 8 + Math.sin(firefly.phase) * 3
      const fireflyGlow = ctx.createRadialGradient(firefly.x, firefly.y, 0, firefly.x, firefly.y, glowSize)
      fireflyGlow.addColorStop(0, '#FFFF99')
      fireflyGlow.addColorStop(0.5, 'rgba(255, 255, 100, 0.5)')
      fireflyGlow.addColorStop(1, 'rgba(255, 255, 100, 0)')
      
      ctx.fillStyle = fireflyGlow
      ctx.beginPath()
      ctx.arc(firefly.x, firefly.y, glowSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Firefly core
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(firefly.x, firefly.y, 2, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    })
    
    // Add magical sparkles
    for (let i = 0; i < 15; i++) {
      const sparkleX = Math.random() * width
      const sparkleY = Math.random() * height
      const sparklePhase = this.time * 3 + i
      const sparkleAlpha = (Math.sin(sparklePhase) * 0.5 + 0.5) * 0.8
      
      if (sparkleAlpha > 0.5) {
        ctx.save()
        ctx.globalAlpha = sparkleAlpha
        ctx.fillStyle = '#CCFFCC'
        ctx.translate(sparkleX, sparkleY)
        ctx.rotate(sparklePhase)
        
        // Draw 4-pointed star
        ctx.beginPath()
        ctx.moveTo(0, -3)
        ctx.lineTo(1, -1)
        ctx.lineTo(3, 0)
        ctx.lineTo(1, 1)
        ctx.lineTo(0, 3)
        ctx.lineTo(-1, 1)
        ctx.lineTo(-3, 0)
        ctx.lineTo(-1, -1)
        ctx.closePath()
        ctx.fill()
        
        ctx.restore()
      }
    }
    
    // Add moonbeams through trees
    for (let i = 0; i < 3; i++) {
      const beamX = width * (0.2 + i * 0.3)
      const beamAngle = Math.sin(this.time + i) * 0.1
      
      ctx.save()
      ctx.translate(beamX, 0)
      ctx.rotate(beamAngle)
      ctx.globalAlpha = 0.1
      
      const beamGradient = ctx.createLinearGradient(0, 0, 0, height)
      beamGradient.addColorStop(0, 'rgba(220, 220, 255, 0.3)')
      beamGradient.addColorStop(1, 'rgba(220, 220, 255, 0)')
      
      ctx.fillStyle = beamGradient
      ctx.fillRect(-20, 0, 40, height)
      
      ctx.restore()
    }
  }
}