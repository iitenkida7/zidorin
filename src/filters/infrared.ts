import { Filter } from '../types/filter'

export class InfraredFilter implements Filter {
  id = 'infrared' as const
  name = '赤外線'
  icon = '🌡️'
  category = 'special' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate temperature-like value based on luminance and color
      const temp = (r * 0.3 + g * 0.4 + b * 0.3)
      
      // Map temperature to infrared color palette
      let newR, newG, newB
      
      if (temp < 64) {
        // Cold - Purple to Blue
        newR = Math.floor(temp * 2)
        newG = 0
        newB = Math.floor(128 + temp * 2)
      } else if (temp < 128) {
        // Cool - Blue to Cyan
        const t = temp - 64
        newR = 0
        newG = Math.floor(t * 2)
        newB = Math.floor(255 - t)
      } else if (temp < 192) {
        // Warm - Green to Yellow
        const t = temp - 128
        newR = Math.floor(t * 4)
        newG = 255
        newB = 0
      } else {
        // Hot - Yellow to Red
        const t = temp - 192
        newR = 255
        newG = Math.floor(255 - t * 4)
        newB = 0
      }
      
      data[i] = Math.min(255, newR)
      data[i + 1] = Math.min(255, newG)
      data[i + 2] = Math.min(255, newB)
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add thermal overlay effects
    this.addThermalOverlay(ctx, width, height)
  }
  
  private addThermalOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add temperature scale bar
    const barWidth = 20
    const barHeight = height * 0.6
    const barX = width - 40
    const barY = height * 0.2
    
    // Draw temperature gradient bar
    const gradient = ctx.createLinearGradient(0, barY + barHeight, 0, barY)
    gradient.addColorStop(0, 'rgb(128, 0, 255)')  // Cold - Purple
    gradient.addColorStop(0.25, 'rgb(0, 0, 255)') // Blue
    gradient.addColorStop(0.5, 'rgb(0, 255, 255)') // Cyan
    gradient.addColorStop(0.75, 'rgb(255, 255, 0)') // Yellow
    gradient.addColorStop(1, 'rgb(255, 0, 0)')     // Hot - Red
    
    ctx.fillStyle = gradient
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    // Add border to temperature bar
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    if (ctx.strokeRect) {
      ctx.strokeRect(barX, barY, barWidth, barHeight)
    } else {
      // Fallback for test environment
      ctx.beginPath()
      ctx.rect(barX, barY, barWidth, barHeight)
      ctx.stroke()
    }
    
    // Add temperature labels
    ctx.fillStyle = 'white'
    ctx.font = '10px monospace'
    ctx.fillText('HOT', barX - 25, barY + 10)
    ctx.fillText('COLD', barX - 30, barY + barHeight)
    
    // Add crosshair in center
    const centerX = width / 2
    const centerY = height / 2
    const crossSize = 20
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - crossSize, centerY)
    ctx.lineTo(centerX + crossSize, centerY)
    ctx.moveTo(centerX, centerY - crossSize)
    ctx.lineTo(centerX, centerY + crossSize)
    ctx.stroke()
    
    // Add infrared camera overlay text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '12px monospace'
    ctx.fillText('INFRARED CAM', 10, 25)
    ctx.fillText('TEMP SCAN', 10, 45)
  }
}