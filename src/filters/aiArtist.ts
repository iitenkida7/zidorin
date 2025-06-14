import { Filter } from '../types/filter'

export class AIArtistFilter implements Filter {
  id = 'aiartist' as const
  name = 'AI画家'
  icon = '🎨'
  category = 'special' as const
  private artStyles = [
    { name: 'ピカソ風', transform: this.picassoStyle.bind(this) },
    { name: 'モネ風', transform: this.monetStyle.bind(this) },
    { name: 'ゴッホ風', transform: this.vanGoghStyle.bind(this) },
    { name: 'ウォーホル風', transform: this.warholStyle.bind(this) },
    { name: '油彩風', transform: this.oilPaintingStyle.bind(this) },
    { name: '水彩風', transform: this.watercolorStyle.bind(this) },
    { name: '鉛筆画風', transform: this.pencilStyle.bind(this) },
    { name: 'アニメ風', transform: this.animeStyle.bind(this) }
  ]
  private currentStyleIndex = 0
  private styleChangeTimer = 0
  private brushStrokes: Array<{ x: number; y: number; color: string; size: number; angle: number; opacity: number }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.styleChangeTimer++
    
    // Change style every 300 frames (about 10 seconds at 30fps)
    if (this.styleChangeTimer % 300 === 0) {
      this.currentStyleIndex = (this.currentStyleIndex + 1) % this.artStyles.length
      this.brushStrokes = [] // Clear brush strokes when changing style
    }
    
    const currentStyle = this.artStyles[this.currentStyleIndex]
    
    // Apply the current art style transformation
    currentStyle.transform(ctx, width, height)
    
    // Draw style indicator
    this.drawStyleIndicator(ctx, width, height, currentStyle.name)
  }
  
  private picassoStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Cubist fragmentation effect
    const imageData = ctx.getImageData(0, 0, width, height)
    const newImageData = ctx.createImageData(width, height)
    
    // Create angular fragments
    for (let y = 0; y < height; y += 20) {
      for (let x = 0; x < width; x += 20) {
        const angle = Math.random() * Math.PI * 2
        const centerX = x + 10
        const centerY = y + 10
        
        // Sample color from center of fragment
        const centerIdx = (Math.floor(centerY) * width + Math.floor(centerX)) * 4
        const r = imageData.data[centerIdx]
        const g = imageData.data[centerIdx + 1]
        const b = imageData.data[centerIdx + 2]
        
        // Apply cubist color transformation
        const newR = Math.min(255, r * 1.2)
        const newG = Math.min(255, g * 0.8)
        const newB = Math.min(255, b * 1.1)
        
        // Fill fragment with transformed color
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        ctx.fillStyle = `rgb(${newR}, ${newG}, ${newB})`
        ctx.fillRect(-10, -10, 20, 20)
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.strokeRect(-10, -10, 20, 20)
        ctx.restore()
      }
    }
  }
  
  private monetStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Impressionist soft brush strokes
    const imageData = ctx.getImageData(0, 0, width, height)
    
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.7
    
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      
      const pixelIdx = (Math.floor(y) * width + Math.floor(x)) * 4
      const r = imageData.data[pixelIdx]
      const g = imageData.data[pixelIdx + 1]
      const b = imageData.data[pixelIdx + 2]
      
      // Soft, organic brush strokes
      const size = Math.random() * 8 + 2
      const angle = Math.random() * Math.PI * 2
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    ctx.restore()
  }
  
  private vanGoghStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Swirling, energetic brush strokes
    const imageData = ctx.getImageData(0, 0, width, height)
    
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    for (let y = 0; y < height; y += 5) {
      for (let x = 0; x < width; x += 5) {
        const pixelIdx = (y * width + x) * 4
        const r = imageData.data[pixelIdx]
        const g = imageData.data[pixelIdx + 1]
        const b = imageData.data[pixelIdx + 2]
        
        // Create swirling motion
        const swirl = Math.sin(x * 0.02) + Math.cos(y * 0.02)
        const angle = swirl * Math.PI + (x + y) * 0.01
        
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        
        // Thick, textured strokes
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        
        ctx.beginPath()
        ctx.moveTo(-5, 0)
        ctx.lineTo(5, 0)
        ctx.stroke()
        
        ctx.restore()
      }
    }
    
    ctx.restore()
  }
  
  private warholStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Pop art high contrast colors
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    const colors = [
      [255, 0, 255], // Magenta
      [0, 255, 255], // Cyan
      [255, 255, 0], // Yellow
      [255, 0, 0],   // Red
    ]
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      const colorIndex = Math.floor((brightness / 255) * (colors.length - 1))
      const color = colors[colorIndex]
      
      data[i] = color[0]
      data[i + 1] = color[1]
      data[i + 2] = color[2]
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add halftone dots effect
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        const intensity = Math.random()
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity * 0.3})`
        ctx.beginPath()
        ctx.arc(x, y, intensity * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    ctx.restore()
  }
  
  private oilPaintingStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Thick, textured paint effect
    const imageData = ctx.getImageData(0, 0, width, height)
    
    ctx.save()
    
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        const pixelIdx = (y * width + x) * 4
        const r = imageData.data[pixelIdx]
        const g = imageData.data[pixelIdx + 1]
        const b = imageData.data[pixelIdx + 2]
        
        // Thick brush stroke
        const size = Math.random() * 6 + 4
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.beginPath()
        ctx.arc(x + Math.random() * 4 - 2, y + Math.random() * 4 - 2, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add texture
        ctx.fillStyle = `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.5)`
        ctx.beginPath()
        ctx.arc(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    ctx.restore()
  }
  
  private watercolorStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Soft, translucent washes
    const imageData = ctx.getImageData(0, 0, width, height)
    
    ctx.save()
    ctx.globalAlpha = 0.8
    
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 30 + 10
      
      const pixelIdx = (Math.floor(y) * width + Math.floor(x)) * 4
      const r = imageData.data[pixelIdx]
      const g = imageData.data[pixelIdx + 1]
      const b = imageData.data[pixelIdx + 2]
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.1)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }
  
  private pencilStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Convert to grayscale pencil sketch
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add pencil texture
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const angle = Math.random() * Math.PI * 2
      const length = Math.random() * 10 + 5
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(length, 0)
      ctx.stroke()
      
      ctx.restore()
    }
    
    ctx.restore()
  }
  
  private animeStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Anime-style cel shading
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Quantize colors for cel shading effect
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / 64) * 64     // Red
      data[i + 1] = Math.floor(data[i + 1] / 64) * 64 // Green
      data[i + 2] = Math.floor(data[i + 2] / 64) * 64 // Blue
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add outline effect
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.lineWidth = 2
    
    // Simple edge detection for outlines
    for (let y = 2; y < height - 2; y += 4) {
      for (let x = 2; x < width - 2; x += 4) {
        const centerIdx = (y * width + x) * 4
        const rightIdx = (y * width + (x + 2)) * 4
        const bottomIdx = ((y + 2) * width + x) * 4
        
        const centerBrightness = (imageData.data[centerIdx] + imageData.data[centerIdx + 1] + imageData.data[centerIdx + 2]) / 3
        const rightBrightness = (imageData.data[rightIdx] + imageData.data[rightIdx + 1] + imageData.data[rightIdx + 2]) / 3
        const bottomBrightness = (imageData.data[bottomIdx] + imageData.data[bottomIdx + 1] + imageData.data[bottomIdx + 2]) / 3
        
        if (Math.abs(centerBrightness - rightBrightness) > 30 || Math.abs(centerBrightness - bottomBrightness) > 30) {
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }
    
    ctx.restore()
  }
  
  private drawStyleIndicator(ctx: CanvasRenderingContext2D, width: number, height: number, styleName: string): void {
    const indicatorX = 20
    const indicatorY = height - 60
    const indicatorWidth = 180
    const indicatorHeight = 40
    
    ctx.save()
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight)
    
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.strokeRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight)
    
    // Title
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('AI ARTIST MODE', indicatorX + 10, indicatorY + 15)
    
    // Current style
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '14px Arial'
    ctx.fillText(styleName, indicatorX + 10, indicatorY + 32)
    
    // Progress bar for style change
    const progress = (this.styleChangeTimer % 300) / 300
    const progressWidth = (indicatorWidth - 20) * progress
    
    ctx.fillStyle = '#333333'
    ctx.fillRect(indicatorX + 10, indicatorY + 35, indicatorWidth - 20, 3)
    
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(indicatorX + 10, indicatorY + 35, progressWidth, 3)
    
    ctx.restore()
  }
}