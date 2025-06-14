import { Filter } from '../types/filter'

export class MatrixFilter implements Filter {
  id = 'matrix' as const
  name = 'マトリックス'
  icon = '💚'
  category = 'decorate' as const
  private drops: Array<{ x: number; y: number; speed: number; chars: string[] }> = []
  private characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Initialize drops if needed
    if (this.drops.length === 0) {
      const columns = Math.floor(width / 20)
      for (let i = 0; i < columns; i++) {
        this.drops.push({
          x: i * 20,
          y: Math.random() * height,
          speed: Math.random() * 3 + 1,
          chars: []
        })
      }
    }
    
    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)
    
    // Draw matrix rain
    ctx.font = '14px monospace'
    
    this.drops.forEach(drop => {
      // Add new character
      if (Math.random() > 0.95) {
        drop.chars.unshift(this.characters[Math.floor(Math.random() * this.characters.length)])
        if (drop.chars.length > 20) {
          drop.chars.pop()
        }
      }
      
      // Draw the characters
      drop.chars.forEach((char, index) => {
        const alpha = Math.max(0, 1 - index * 0.1)
        const green = Math.floor(255 * alpha)
        
        ctx.fillStyle = `rgb(0, ${green}, 0)`
        ctx.fillText(char, drop.x, drop.y - index * 20)
      })
      
      // Move drop down
      drop.y += drop.speed
      
      // Reset if off screen
      if (drop.y > height + 100) {
        drop.y = -100
        drop.chars = []
      }
    })
  }
}