import { Filter } from '../types/filter'

export class ColorPaletteFilter implements Filter {
  id = 'colorpalette' as const
  name = 'カラーパレット'
  icon = '🎨'
  category = 'special' as const
  private dominantColors: Array<{ r: number; g: number; b: number; percentage: number }> = []
  private analysisTime = 0
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.analysisTime++
    
    // Analyze colors every 30 frames to avoid performance issues
    if (this.analysisTime % 30 === 0) {
      this.analyzeColors(ctx, width, height)
    }
    
    // Draw color palette
    this.drawColorPalette(ctx, width, height)
  }
  
  private analyzeColors(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Sample pixels for performance (every 10th pixel)
    const colorMap = new Map<string, number>()
    const sampleStep = 10
    
    for (let i = 0; i < data.length; i += 4 * sampleStep) {
      const r = Math.floor(data[i] / 32) * 32 // Quantize colors
      const g = Math.floor(data[i + 1] / 32) * 32
      const b = Math.floor(data[i + 2] / 32) * 32
      
      const colorKey = `${r},${g},${b}`
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1)
    }
    
    // Sort colors by frequency and get top 8
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    
    const totalSamples = Array.from(colorMap.values()).reduce((sum, count) => sum + count, 0)
    
    this.dominantColors = sortedColors.map(([colorKey, count]) => {
      const [r, g, b] = colorKey.split(',').map(Number)
      return {
        r,
        g,
        b,
        percentage: (count / totalSamples) * 100
      }
    })
  }
  
  private drawColorPalette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.dominantColors.length === 0) return
    
    const paletteWidth = 200
    const paletteHeight = 120
    const paletteX = width - paletteWidth - 20
    const paletteY = 20
    
    ctx.save()
    
    // Palette background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(paletteX, paletteY, paletteWidth, paletteHeight)
    
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    ctx.strokeRect(paletteX, paletteY, paletteWidth, paletteHeight)
    
    // Title
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('カラーパレット', paletteX + paletteWidth / 2, paletteY + 20)
    
    // Color swatches
    const swatchSize = 20
    const swatchSpacing = 4
    const swatchesPerRow = 4
    const startY = paletteY + 35
    
    this.dominantColors.forEach((color, index) => {
      const row = Math.floor(index / swatchesPerRow)
      const col = index % swatchesPerRow
      
      const swatchX = paletteX + 10 + col * (swatchSize + swatchSpacing + 35)
      const swatchY = startY + row * (swatchSize + swatchSpacing + 15)
      
      // Color swatch
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.fillRect(swatchX, swatchY, swatchSize, swatchSize)
      
      // Swatch border
      ctx.strokeStyle = '#999999'
      ctx.lineWidth = 1
      ctx.strokeRect(swatchX, swatchY, swatchSize, swatchSize)
      
      // Percentage text
      ctx.fillStyle = '#333333'
      ctx.font = '10px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(
        `${color.percentage.toFixed(1)}%`,
        swatchX + swatchSize + 5,
        swatchY + swatchSize / 2 + 3
      )
      
      // Color values (RGB)
      ctx.font = '8px Arial'
      ctx.fillText(
        `${color.r},${color.g},${color.b}`,
        swatchX,
        swatchY + swatchSize + 12
      )
    })
    
    // Color harmony analysis
    if (this.dominantColors.length >= 3) {
      const harmonyY = paletteY + paletteHeight - 25
      const harmony = this.analyzeColorHarmony()
      
      ctx.fillStyle = '#333333'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`配色: ${harmony}`, paletteX + paletteWidth / 2, harmonyY)
    }
    
    // Live color picker (show color under cursor simulation)
    this.drawLiveColorPicker(ctx, width, height)
    
    ctx.restore()
  }
  
  private analyzeColorHarmony(): string {
    if (this.dominantColors.length < 3) return '不明'
    
    const colors = this.dominantColors.slice(0, 3)
    
    // Convert RGB to HSL for harmony analysis
    const hslColors = colors.map(color => this.rgbToHsl(color.r, color.g, color.b))
    
    // Calculate hue differences
    const hueDiffs = []
    for (let i = 0; i < hslColors.length - 1; i++) {
      const diff = Math.abs(hslColors[i][0] - hslColors[i + 1][0])
      hueDiffs.push(Math.min(diff, 360 - diff))
    }
    
    const avgHueDiff = hueDiffs.reduce((sum, diff) => sum + diff, 0) / hueDiffs.length
    
    // Determine harmony type
    if (avgHueDiff < 30) return 'モノクロマティック'
    if (avgHueDiff < 60) return 'アナロガス'
    if (avgHueDiff > 150) return 'コンプリメンタリー'
    if (avgHueDiff > 90) return 'トライアディック'
    return 'テトラディック'
  }
  
  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    
    return [h * 360, s * 100, l * 100]
  }
  
  private drawLiveColorPicker(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Simulate a color picker at center of screen
    const centerX = width / 2
    const centerY = height / 2
    const pickerSize = 60
    
    // Get color at center
    const imageData = ctx.getImageData(centerX - 1, centerY - 1, 3, 3)
    const data = imageData.data
    
    // Average the 3x3 area
    let r = 0, g = 0, b = 0
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
    }
    r = Math.floor(r / 9)
    g = Math.floor(g / 9)
    b = Math.floor(b / 9)
    
    ctx.save()
    ctx.globalAlpha = 0.8
    
    // Picker background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(centerX - pickerSize / 2, centerY + 40, pickerSize, 40)
    
    // Color sample
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(centerX - pickerSize / 2 + 5, centerY + 45, 20, 20)
    
    // Color info
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`RGB: ${r}, ${g}, ${b}`, centerX - pickerSize / 2 + 30, centerY + 55)
    
    const [h, s, l] = this.rgbToHsl(r, g, b)
    ctx.fillText(`HSL: ${Math.round(h)}, ${Math.round(s)}, ${Math.round(l)}`, centerX - pickerSize / 2 + 30, centerY + 70)
    
    // Crosshair
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 10, centerY)
    ctx.lineTo(centerX + 10, centerY)
    ctx.moveTo(centerX, centerY - 10)
    ctx.lineTo(centerX, centerY + 10)
    ctx.stroke()
    
    ctx.restore()
  }
}