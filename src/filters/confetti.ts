import { Filter } from '../types/filter'

export class ConfettiFilter implements Filter {
  id = 'confetti' as const
  name = '紙ふぶき'
  icon = '🎊'
  category = 'decorate' as const
  private confetti: Array<{ x: number; y: number; vx: number; vy: number; rotation: number; color: string; size: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add new confetti
    if (Math.random() > 0.8) {
      const colors = ['#FF69B4', '#FFD700', '#00CED1', '#FF6347', '#98FB98', '#DDA0DD']
      for (let i = 0; i < 3; i++) {
        this.confetti.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4
        })
      }
    }
    
    // Update and draw confetti
    this.confetti = this.confetti.filter(piece => {
      piece.x += piece.vx
      piece.y += piece.vy
      piece.rotation += 5
      piece.vy += 0.1 // gravity
      
      if (piece.y < height + 20) {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate((piece.rotation * Math.PI) / 180)
        
        // Draw confetti piece
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2)
        
        ctx.restore()
        return true
      }
      return false
    })
  }
}