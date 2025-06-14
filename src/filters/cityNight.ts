import { Filter } from '../types/filter'

export class CityNightFilter implements Filter {
  id = 'citynight' as const
  name = '夜景'
  icon = '🌃'
  category = 'background' as const
  private time = 0
  private buildings: Array<{ x: number; width: number; height: number; windows: Array<{ x: number; y: number; lit: boolean }> }> = []
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.time += 0.02
    
    // Initialize buildings if needed
    if (this.buildings.length === 0) {
      let currentX = 0
      while (currentX < width) {
        const buildingWidth = Math.random() * 80 + 40
        const buildingHeight = Math.random() * height * 0.6 + height * 0.3
        
        const building = {
          x: currentX,
          width: buildingWidth,
          height: buildingHeight,
          windows: [] as Array<{ x: number; y: number; lit: boolean }>
        }
        
        // Generate windows
        for (let y = height - buildingHeight + 20; y < height - 20; y += 25) {
          for (let x = currentX + 10; x < currentX + buildingWidth - 10; x += 20) {
            building.windows.push({
              x: x,
              y: y,
              lit: Math.random() > 0.4
            })
          }
        }
        
        this.buildings.push(building)
        currentX += buildingWidth
      }
    }
    
    // Draw night sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#0F0F23') // Dark blue night sky
    gradient.addColorStop(0.7, '#1a1a2e')
    gradient.addColorStop(1, '#16213e') // Horizon glow
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add stars
    for (let i = 0; i < 50; i++) {
      const starX = (Math.sin(this.time + i) * width + width) % width
      const starY = Math.random() * height * 0.4
      const twinkle = Math.sin(this.time * 5 + i) * 0.5 + 0.5
      
      ctx.save()
      ctx.globalAlpha = twinkle
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(starX, starY, 1, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    
    // Draw moon
    const moonX = width * 0.8
    const moonY = height * 0.2
    
    ctx.save()
    ctx.globalAlpha = 0.9
    ctx.fillStyle = '#F5F5DC'
    ctx.beginPath()
    ctx.arc(moonX, moonY, 30, 0, Math.PI * 2)
    ctx.fill()
    
    // Moon glow
    ctx.globalAlpha = 0.3
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 30, moonX, moonY, 80)
    moonGlow.addColorStop(0, '#F5F5DC')
    moonGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = moonGlow
    ctx.beginPath()
    ctx.arc(moonX, moonY, 80, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    
    // Draw buildings
    this.buildings.forEach(building => {
      // Building silhouette
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(building.x, height - building.height, building.width, building.height)
      
      // Building outline
      ctx.strokeStyle = '#333333'
      ctx.lineWidth = 1
      if (ctx.strokeRect) {
        ctx.strokeRect(building.x, height - building.height, building.width, building.height)
      } else if (ctx.rect && ctx.beginPath && ctx.stroke) {
        // Fallback for test environment
        ctx.beginPath()
        ctx.rect(building.x, height - building.height, building.width, building.height)
        ctx.stroke()
      }
      // Skip drawing outline if neither method is available
      
      // Windows
      building.windows.forEach(window => {
        if (window.lit) {
          // Randomly flicker some windows
          const flicker = Math.random() > 0.98 ? 0.3 : 1.0
          
          ctx.save()
          ctx.globalAlpha = flicker
          
          // Window glow
          ctx.fillStyle = '#FFFF99'
          ctx.fillRect(window.x - 1, window.y - 1, 12, 8)
          
          // Bright window
          ctx.fillStyle = '#FFFFCC'
          ctx.fillRect(window.x, window.y, 10, 6)
          
          ctx.restore()
        } else {
          // Dark window
          ctx.fillStyle = '#2a2a2a'
          ctx.fillRect(window.x, window.y, 10, 6)
        }
      })
    })
    
    // Add moving clouds
    for (let i = 0; i < 3; i++) {
      const cloudX = ((this.time * 20 + i * 200) % (width + 100)) - 50
      const cloudY = height * 0.1 + Math.sin(this.time + i) * 20
      
      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.fillStyle = '#444444'
      
      // Draw cloud shape
      ctx.beginPath()
      ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2)
      ctx.arc(cloudX + 25, cloudY, 25, 0, Math.PI * 2)
      ctx.arc(cloudX + 50, cloudY, 20, 0, Math.PI * 2)
      ctx.arc(cloudX + 25, cloudY - 15, 15, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
    
    // Add distant city lights on horizon
    ctx.save()
    ctx.globalAlpha = 0.6
    for (let x = 0; x < width; x += 10) {
      const lightHeight = Math.random() * 5 + 2
      ctx.fillStyle = '#FFAA00'
      ctx.fillRect(x, height - lightHeight, 1, lightHeight)
    }
    ctx.restore()
  }
}