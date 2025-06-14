import { Filter } from '../types/filter'

export class ObjectDetectorFilter implements Filter {
  id = 'objectdetector' as const
  name = 'オブジェクト認識'
  icon = '🔍'
  category = 'special' as const
  private detectedObjects: Array<{ 
    name: string; 
    confidence: number; 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    color: string;
    time: number;
  }> = []
  private analysisFrame = 0
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.analysisFrame++
    
    // Perform object detection every 60 frames to avoid performance issues
    if (this.analysisFrame % 60 === 0) {
      this.performObjectDetection(ctx, width, height)
    }
    
    // Clean up old detections
    const now = Date.now()
    this.detectedObjects = this.detectedObjects.filter(obj => now - obj.time < 5000)
    
    this.drawDetections(ctx, width, height)
  }
  
  private performObjectDetection(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Simplified object detection based on color regions and shapes
    // In a real implementation, you'd use a proper object detection model like YOLO or MobileNet
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Clear previous detections
    this.detectedObjects = []
    
    // Detect face-like regions (large skin-colored areas)
    this.detectFaces(data, width, height)
    
    // Detect hand-like regions (smaller skin-colored areas)
    this.detectHands(data, width, height)
    
    // Detect bright objects (lights, screens)
    this.detectBrightObjects(data, width, height)
    
    // Detect text-like regions (high contrast areas)
    this.detectTextRegions(data, width, height)
  }
  
  private detectFaces(data: Uint8ClampedArray, width: number, height: number): void {
    // Look for skin-colored regions
    const regions = this.findColorRegions(data, width, height, 
      (r, g, b) => {
        // Simple skin detection
        return r > 95 && g > 40 && b > 20 && 
               Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
               Math.abs(r - g) > 15 && r > g && r > b
      }
    )
    
    // Filter for face-sized regions
    regions.forEach(region => {
      if (region.width > 60 && region.height > 60 && 
          region.width / region.height > 0.7 && region.width / region.height < 1.5) {
        this.detectedObjects.push({
          name: '顔',
          confidence: 0.8,
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
          color: '#FF6B6B',
          time: Date.now()
        })
      }
    })
  }
  
  private detectHands(data: Uint8ClampedArray, width: number, height: number): void {
    const regions = this.findColorRegions(data, width, height,
      (r, g, b) => {
        // Skin detection (same as face but looking for smaller regions)
        return r > 95 && g > 40 && b > 20 && 
               Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
               Math.abs(r - g) > 15 && r > g && r > b
      }
    )
    
    regions.forEach(region => {
      if (region.width > 20 && region.width < 80 && 
          region.height > 20 && region.height < 80) {
        this.detectedObjects.push({
          name: '手',
          confidence: 0.6,
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
          color: '#4ECDC4',
          time: Date.now()
        })
      }
    })
  }
  
  private detectBrightObjects(data: Uint8ClampedArray, width: number, height: number): void {
    const regions = this.findColorRegions(data, width, height,
      (r, g, b) => {
        const brightness = (r + g + b) / 3
        return brightness > 200
      }
    )
    
    regions.forEach(region => {
      if (region.width > 30 && region.height > 30) {
        this.detectedObjects.push({
          name: '光源',
          confidence: 0.7,
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
          color: '#FFE66D',
          time: Date.now()
        })
      }
    })
  }
  
  private detectTextRegions(data: Uint8ClampedArray, width: number, height: number): void {
    // Detect high contrast regions that might contain text
    const edgeMap = this.detectEdges(data, width, height)
    const regions = this.findEdgeRegions(edgeMap, width, height)
    
    regions.forEach(region => {
      if (region.width > 40 && region.height > 15 && 
          region.width / region.height > 2) { // Text-like aspect ratio
        this.detectedObjects.push({
          name: 'テキスト',
          confidence: 0.5,
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
          color: '#A8E6CF',
          time: Date.now()
        })
      }
    })
  }
  
  private findColorRegions(data: Uint8ClampedArray, width: number, height: number, 
                          colorTest: (r: number, g: number, b: number) => boolean): Array<{x: number, y: number, width: number, height: number}> {
    const visited = new Set<number>()
    const regions: Array<{x: number, y: number, width: number, height: number}> = []
    
    for (let y = 0; y < height; y += 10) { // Sample every 10 pixels for performance
      for (let x = 0; x < width; x += 10) {
        const idx = (y * width + x) * 4
        if (visited.has(idx)) continue
        
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        
        if (colorTest(r, g, b)) {
          const region = this.floodFill(data, width, height, x, y, colorTest, visited)
          if (region && region.width > 20 && region.height > 20) {
            regions.push(region)
          }
        }
      }
    }
    
    return regions
  }
  
  private floodFill(data: Uint8ClampedArray, width: number, height: number, 
                    startX: number, startY: number,
                    colorTest: (r: number, g: number, b: number) => boolean,
                    visited: Set<number>): {x: number, y: number, width: number, height: number} | null {
    const stack = [{x: startX, y: startY}]
    const points: Array<{x: number, y: number}> = []
    
    while (stack.length > 0 && points.length < 100) { // Limit for performance
      const {x, y} = stack.pop()!
      
      if (x < 0 || x >= width || y < 0 || y >= height) continue
      
      const idx = (y * width + x) * 4
      if (visited.has(idx)) continue
      
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      
      if (!colorTest(r, g, b)) continue
      
      visited.add(idx)
      points.push({x, y})
      
      // Add neighbors (simplified - only check 4 directions with larger steps)
      stack.push({x: x + 10, y})
      stack.push({x: x - 10, y})
      stack.push({x, y: y + 10})
      stack.push({x, y: y - 10})
    }
    
    if (points.length < 10) return null
    
    const minX = Math.min(...points.map(p => p.x))
    const maxX = Math.max(...points.map(p => p.x))
    const minY = Math.min(...points.map(p => p.y))
    const maxY = Math.max(...points.map(p => p.y))
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }
  
  private detectEdges(data: Uint8ClampedArray, width: number, height: number): number[] {
    const edges = new Array(width * height).fill(0)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // Simple Sobel edge detection
        const tl = this.getGrayscale(data, (y - 1) * width + (x - 1))
        const tm = this.getGrayscale(data, (y - 1) * width + x)
        const tr = this.getGrayscale(data, (y - 1) * width + (x + 1))
        const ml = this.getGrayscale(data, y * width + (x - 1))
        const mr = this.getGrayscale(data, y * width + (x + 1))
        const bl = this.getGrayscale(data, (y + 1) * width + (x - 1))
        const bm = this.getGrayscale(data, (y + 1) * width + x)
        const br = this.getGrayscale(data, (y + 1) * width + (x + 1))
        
        const gx = -tl - 2 * ml - bl + tr + 2 * mr + br
        const gy = -tl - 2 * tm - tr + bl + 2 * bm + br
        
        edges[y * width + x] = Math.sqrt(gx * gx + gy * gy)
      }
    }
    
    return edges
  }
  
  private getGrayscale(data: Uint8ClampedArray, pixelIndex: number): number {
    const idx = pixelIndex * 4
    return (data[idx] + data[idx + 1] + data[idx + 2]) / 3
  }
  
  private findEdgeRegions(edges: number[], width: number, height: number): Array<{x: number, y: number, width: number, height: number}> {
    const regions: Array<{x: number, y: number, width: number, height: number}> = []
    const threshold = 50
    
    for (let y = 0; y < height - 20; y += 20) {
      for (let x = 0; x < width - 40; x += 20) {
        let edgeCount = 0
        
        // Count edges in 40x20 region
        for (let dy = 0; dy < 20; dy++) {
          for (let dx = 0; dx < 40; dx++) {
            if (edges[(y + dy) * width + (x + dx)] > threshold) {
              edgeCount++
            }
          }
        }
        
        if (edgeCount > 100) { // High edge density
          regions.push({x, y, width: 40, height: 20})
        }
      }
    }
    
    return regions
  }
  
  private drawDetections(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save()
    
    this.detectedObjects.forEach(obj => {
      const age = (Date.now() - obj.time) / 5000
      const alpha = Math.max(0, 1 - age)
      
      ctx.save()
      ctx.globalAlpha = alpha
      
      // Bounding box
      ctx.strokeStyle = obj.color
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
      
      // Label background
      const labelText = `${obj.name} ${Math.round(obj.confidence * 100)}%`
      const textMetrics = ctx.measureText(labelText)
      const labelWidth = textMetrics.width + 10
      const labelHeight = 20
      
      ctx.fillStyle = obj.color
      ctx.fillRect(obj.x, obj.y - labelHeight, labelWidth, labelHeight)
      
      // Label text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(labelText, obj.x + 5, obj.y - labelHeight / 2)
      
      // Confidence indicator
      const confidenceWidth = obj.width * obj.confidence
      ctx.fillStyle = `${obj.color}80`
      ctx.fillRect(obj.x, obj.y + obj.height - 3, confidenceWidth, 3)
      
      ctx.restore()
    })
    
    // Draw detection stats
    this.drawDetectionStats(ctx, width, height)
    
    ctx.restore()
  }
  
  private drawDetectionStats(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const statsX = width - 220
    const statsY = height - 120
    const statsWidth = 200
    const statsHeight = 100
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(statsX, statsY, statsWidth, statsHeight)
    
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 1
    if (ctx.strokeRect) {
      ctx.strokeRect(statsX, statsY, statsWidth, statsHeight)
    } else if (ctx.rect && ctx.beginPath && ctx.stroke) {
      // Fallback for test environment
      ctx.beginPath()
      ctx.rect(statsX, statsY, statsWidth, statsHeight)
      ctx.stroke()
    }
    // Skip drawing outline if neither method is available
    
    ctx.fillStyle = '#00FFFF'
    ctx.font = 'bold 12px Courier'
    ctx.textAlign = 'left'
    ctx.fillText('OBJECT DETECTION', statsX + 10, statsY + 15)
    
    ctx.font = '10px Courier'
    ctx.fillText(`Objects Found: ${this.detectedObjects.length}`, statsX + 10, statsY + 35)
    
    // Count by type
    const typeCounts = this.detectedObjects.reduce((counts, obj) => {
      counts[obj.name] = (counts[obj.name] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    
    let yOffset = 50
    Object.entries(typeCounts).forEach(([type, count]) => {
      ctx.fillText(`${type}: ${count}`, statsX + 10, statsY + yOffset)
      yOffset += 15
    })
  }
}