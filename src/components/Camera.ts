import { FilterId } from '../types/filter'
import { getFilter } from '../filters'

export class Camera {
  private container: HTMLElement | null = null
  private video: HTMLVideoElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private stream: MediaStream | null = null
  private currentFilter: FilterId = 'none'
  private animationId: number | null = null
  
  mount(container: HTMLElement): void {
    this.container = container
    this.render()
    this.initCamera()
  }
  
  private render(): void {
    if (!this.container) return
    
    this.container.innerHTML = `
      <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-white h-full">
        <video
          id="camera-video"
          class="w-full h-full object-cover"
          autoplay
          playsinline
          style="display: none;"
        ></video>
        <canvas
          id="camera-canvas"
          class="w-full h-full object-cover"
        ></canvas>
        <div id="camera-loading" class="absolute inset-0 flex items-center justify-center bg-pastel-blue">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            <p class="mt-4 text-pink-600">カメラを起動中...</p>
          </div>
        </div>
        <div id="controls-container" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"></div>
      </div>
    `
    
    this.video = document.getElementById('camera-video') as HTMLVideoElement
    this.canvas = document.getElementById('camera-canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')
  }
  
  private async initCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      
      if (this.video) {
        this.video.srcObject = this.stream
        
        // iOS Safari requires explicit play() call
        this.video.onloadedmetadata = async () => {
          try {
            await this.video!.play()
            this.setupCanvas()
            this.hideLoading()
            // Add small delay for iOS stability
            setTimeout(() => {
              this.startRendering()
            }, 100)
          } catch (playError) {
            console.error('Video play failed:', playError)
            this.showError()
          }
        }
      }
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error)
      this.showError()
    }
  }
  
  private setupCanvas(): void {
    if (!this.video || !this.canvas) return
    
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight
  }
  
  private hideLoading(): void {
    const loading = document.getElementById('camera-loading')
    if (loading) {
      loading.style.display = 'none'
    }
  }
  
  private showError(): void {
    const loading = document.getElementById('camera-loading')
    if (loading) {
      loading.innerHTML = `
        <div class="text-center">
          <p class="text-2xl mb-2">😢</p>
          <p class="text-pink-600">カメラが使用できません</p>
          <p class="text-sm text-gray-600 mt-2">カメラの使用を許可してください</p>
        </div>
      `
    }
  }
  
  private startRendering(): void {
    let lastFrameTime = 0
    const targetFPS = 30 // Limit FPS for better iOS performance
    const frameInterval = 1000 / targetFPS
    
    const render = async (currentTime: number) => {
      if (!this.video || !this.canvas || !this.ctx) return
      
      // Throttle rendering for iOS performance
      if (currentTime - lastFrameTime < frameInterval) {
        this.animationId = requestAnimationFrame(render)
        return
      }
      
      lastFrameTime = currentTime
      
      // Check if video is ready
      if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
        
        const filter = getFilter(this.currentFilter)
        if (filter) {
          try {
            await filter.apply(this.ctx, this.canvas.width, this.canvas.height)
          } catch (error) {
            console.error('Filter application failed:', error)
          }
        }
      }
      
      this.animationId = requestAnimationFrame(render)
    }
    
    this.animationId = requestAnimationFrame(render)
  }
  
  setFilter(filterId: FilterId): void {
    this.currentFilter = filterId
  }
  
  capture(): string | null {
    if (!this.canvas) return null
    
    return this.canvas.toDataURL('image/png')
  }
  
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}