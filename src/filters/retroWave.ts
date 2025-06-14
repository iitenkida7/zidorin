import { Filter } from '../types/filter'

export class RetroWaveFilter implements Filter {
  id = 'retrowave' as const
  name = 'レトロウェーブ'
  icon = '🌆'
  category = 'background' as const
  private time = 0
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.time += 0.02
    
    // Draw synthwave gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#FF006E') // Hot pink top
    gradient.addColorStop(0.3, '#8338EC') // Purple
    gradient.addColorStop(0.6, '#3A86FF') // Blue
    gradient.addColorStop(1, '#06FFA5') // Cyan bottom
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add moving sun/moon
    const sunY = height * 0.25 + Math.sin(this.time * 0.5) * 20
    const sunSize = Math.min(width, height) * 0.15
    
    // Sun glow
    const sunGlow = ctx.createRadialGradient(width / 2, sunY, 0, width / 2, sunY, sunSize * 2)
    sunGlow.addColorStop(0, 'rgba(255, 255, 0, 0.8)')
    sunGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)')
    sunGlow.addColorStop(1, 'rgba(255, 0, 100, 0)')
    
    ctx.fillStyle = sunGlow
    ctx.beginPath()
    ctx.arc(width / 2, sunY, sunSize * 2, 0, Math.PI * 2)
    ctx.fill()
    
    // Sun/moon body with horizontal lines
    ctx.fillStyle = '#FFFF00'
    ctx.beginPath()
    ctx.arc(width / 2, sunY, sunSize, 0, Math.PI * 2)
    ctx.fill()
    
    // Add horizontal lines across the sun
    ctx.strokeStyle = '#FF006E'
    ctx.lineWidth = 3
    for (let i = -sunSize; i <= sunSize; i += 8) {
      const lineY = sunY + i
      const lineHalfWidth = Math.sqrt(sunSize * sunSize - i * i)
      
      if (lineHalfWidth > 0) {
        ctx.beginPath()
        ctx.moveTo(width / 2 - lineHalfWidth, lineY)
        ctx.lineTo(width / 2 + lineHalfWidth, lineY)
        ctx.stroke()
      }
    }
    
    // Draw grid floor
    const gridStartY = height * 0.6
    const perspectiveScale = 0.3
    
    ctx.strokeStyle = '#FF006E'
    ctx.lineWidth = 2
    
    // Horizontal grid lines
    for (let i = 0; i < 20; i++) {
      const y = gridStartY + i * 15
      const scale = 1 - (y - gridStartY) / (height * 0.4) * perspectiveScale
      const lineWidth = width * scale
      const lineX = (width - lineWidth) / 2
      
      ctx.save()
      ctx.globalAlpha = Math.max(0.1, scale)
      ctx.beginPath()
      ctx.moveTo(lineX, y)
      ctx.lineTo(lineX + lineWidth, y)
      ctx.stroke()
      ctx.restore()
    }
    
    // Vertical grid lines
    const numVerticalLines = 20
    for (let i = 0; i <= numVerticalLines; i++) {
      const xRatio = i / numVerticalLines
      const perspectiveX = width / 2 + (xRatio - 0.5) * width * 2
      
      ctx.save()
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.moveTo(perspectiveX, gridStartY)
      
      // Draw perspective line
      const vanishingPointX = width / 2
      const vanishingPointY = height * 0.4
      
      const dirX = vanishingPointX - perspectiveX
      const dirY = vanishingPointY - gridStartY
      const length = Math.sqrt(dirX * dirX + dirY * dirY)
      
      const normalizedDirX = dirX / length
      const normalizedDirY = dirY / length
      
      ctx.lineTo(
        perspectiveX + normalizedDirX * height * 0.5,
        gridStartY + normalizedDirY * height * 0.5
      )
      ctx.stroke()
      ctx.restore()
    }
    
    // Add moving mountains/cityscape silhouette
    ctx.fillStyle = '#1A1A2E'
    ctx.beginPath()
    ctx.moveTo(0, height * 0.6)
    
    for (let x = 0; x <= width; x += 20) {
      const mountainHeight = Math.sin(x * 0.01 + this.time) * 50 + Math.sin(x * 0.005 + this.time * 0.5) * 30
      ctx.lineTo(x, height * 0.6 - mountainHeight)
    }
    
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()
    
    // Add floating geometric shapes
    for (let i = 0; i < 8; i++) {
      const shapeX = ((this.time * 30 + i * 80) % (width + 100)) - 50
      const shapeY = height * 0.2 + Math.sin(this.time + i) * 30
      const shapeSize = 15 + Math.sin(this.time * 2 + i) * 5
      
      ctx.save()
      ctx.translate(shapeX, shapeY)
      ctx.rotate(this.time + i)
      ctx.globalAlpha = 0.7
      
      if (i % 3 === 0) {
        // Triangle
        ctx.fillStyle = '#00FFFF'
        ctx.beginPath()
        ctx.moveTo(0, -shapeSize)
        ctx.lineTo(shapeSize, shapeSize)
        ctx.lineTo(-shapeSize, shapeSize)
        ctx.closePath()
        ctx.fill()
      } else if (i % 3 === 1) {
        // Square
        ctx.fillStyle = '#FFFF00'
        ctx.fillRect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize)
      } else {
        // Circle
        ctx.fillStyle = '#FF00FF'
        ctx.beginPath()
        ctx.arc(0, 0, shapeSize / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    }
    
    // Add glitch effect lines
    if (Math.random() > 0.95) {
      const glitchY = Math.random() * height
      const glitchHeight = 5 + Math.random() * 10
      
      ctx.save()
      ctx.globalCompositeOperation = 'difference'
      ctx.fillStyle = '#FF00FF'
      ctx.fillRect(0, glitchY, width, glitchHeight)
      ctx.restore()
    }
    
    // Add scanlines effect
    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 1
    
    for (let y = 0; y < height; y += 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.restore()
  }
}