import { Filter } from '../types/filter'

export class SpyFilter implements Filter {
  id = 'spy' as const
  name = 'スパイカメラ'
  icon = '🕵️'
  category = 'special' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Get current image data
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Reduce brightness dramatically for spy effect
    for (let i = 0; i < data.length; i += 4) {
      // Reduce RGB values to create very dark image
      data[i] = Math.max(0, data[i] * 0.05)     // Red
      data[i + 1] = Math.max(0, data[i + 1] * 0.05) // Green
      data[i + 2] = Math.max(0, data[i + 2] * 0.05) // Blue
      // Alpha remains unchanged
    }
    
    // Apply the darkened image
    ctx.putImageData(imageData, 0, 0)
    
    // Add spy camera UI overlay
    this.drawSpyOverlay(ctx, width, height)
  }
  
  private drawSpyOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Save context
    ctx.save()
    
    // Draw subtle grid pattern to indicate spy mode
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)'
    ctx.lineWidth = 1
    
    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // Add spy mode indicator
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
    ctx.fillRect(10, 10, 120, 30)
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'
    ctx.font = '12px monospace'
    ctx.fillText('SPY MODE', 15, 28)
    
    // Add recording indicator (blinking red dot)
    const time = Date.now()
    const blink = Math.sin(time * 0.01) > 0
    if (blink) {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.arc(width - 20, 20, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Restore context
    ctx.restore()
  }
}