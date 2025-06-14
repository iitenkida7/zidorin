import { Filter } from '../types/filter'
import { modelLoader } from '../utils/modelLoader'

export class BackgroundReplaceFilter implements Filter {
  id = 'background' as const
  name = '背景チェンジ'
  icon = '🌈'
  private segmenter: any = null
  private isLoading = false
  private backgroundImage: HTMLImageElement | null = null
  private currentBgIndex = 0
  
  private backgrounds = [
    'https://picsum.photos/640/480?random=1',
    'https://picsum.photos/640/480?random=2',
    'https://picsum.photos/640/480?random=3',
    'https://picsum.photos/640/480?random=4',
    'https://picsum.photos/640/480?random=5'
  ]
  
  async apply(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
    if (this.isLoading) return
    
    if (!this.segmenter) {
      this.isLoading = true
      try {
        this.segmenter = await modelLoader.getSegmenter()
        await this.loadRandomBackground()
      } catch (error) {
        console.error('Segmenter loading failed:', error)
        this.isLoading = false
        return
      }
      this.isLoading = false
    }
    
    if (!this.backgroundImage) {
      await this.loadRandomBackground()
    }
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const video = document.createElement('canvas')
    video.width = width
    video.height = height
    const videoCtx = video.getContext('2d')!
    videoCtx.putImageData(imageData, 0, 0)
    
    try {
      const segmentation = await this.segmenter.segmentPeople(video)
      
      if (segmentation.length > 0) {
        const mask = segmentation[0].mask
        const maskData = mask.getUnderlyingCanvas ?
          mask.getUnderlyingCanvas().getContext('2d')!.getImageData(0, 0, width, height) :
          await mask.toImageData()
        
        // 背景画像を描画
        if (this.backgroundImage) {
          ctx.save()
          ctx.globalCompositeOperation = 'source-over'
          ctx.drawImage(this.backgroundImage, 0, 0, width, height)
          ctx.restore()
        }
        
        // 人物の部分だけを元の画像から描画
        const originalData = imageData.data
        const newImageData = ctx.getImageData(0, 0, width, height)
        const newData = newImageData.data
        
        for (let i = 0; i < maskData.data.length; i += 4) {
          const maskValue = maskData.data[i]
          
          if (maskValue > 128) { // 人物の部分
            const pixelIndex = i
            newData[pixelIndex] = originalData[pixelIndex]
            newData[pixelIndex + 1] = originalData[pixelIndex + 1]
            newData[pixelIndex + 2] = originalData[pixelIndex + 2]
            newData[pixelIndex + 3] = originalData[pixelIndex + 3]
          }
        }
        
        ctx.putImageData(newImageData, 0, 0)
      }
    } catch (error) {
      console.error('Segmentation failed:', error)
    }
  }
  
  private async loadRandomBackground(): Promise<void> {
    return new Promise((resolve) => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgrounds.length
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.backgroundImage = img
        resolve()
      }
      img.onerror = () => {
        // フォールバック: グラデーション背景
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        const ctx = canvas.getContext('2d')!
        
        const gradient = ctx.createLinearGradient(0, 0, 640, 480)
        gradient.addColorStop(0, '#ff9a9e')
        gradient.addColorStop(0.5, '#fecfef')
        gradient.addColorStop(1, '#fecfef')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 640, 480)
        
        this.backgroundImage = new Image()
        this.backgroundImage.src = canvas.toDataURL()
        resolve()
      }
      img.src = this.backgrounds[this.currentBgIndex]
    })
  }
}