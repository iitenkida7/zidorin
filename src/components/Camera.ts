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
  private currentFacingMode: 'user' | 'environment' = 'user'
  private availableCameras: MediaDeviceInfo[] = []
  
  mount(container: HTMLElement): void {
    this.container = container
    this.render()
    this.checkAvailableCameras()
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
        <div id="camera-switch-button" class="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg cursor-pointer hover:bg-white/90 transition-all" style="display: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L15 8V16L9 12Z" fill="#6B7280"/>
            <path d="M20 5H16L14 3H10L8 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5Z" stroke="#6B7280" stroke-width="2" fill="none"/>
            <path d="M14.8 11.2L16.4 9.6C16.8 9.2 17.2 9.2 17.6 9.6L19.2 11.2" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div id="controls-container" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"></div>
      </div>
    `
    
    this.video = document.getElementById('camera-video') as HTMLVideoElement
    this.canvas = document.getElementById('camera-canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')
    this.setupCameraSwitchButton()
  }
  
  private async initCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.currentFacingMode,
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
        // Save context state
        this.ctx.save()
        
        // Mirror the canvas for front-facing camera
        if (this.currentFacingMode === 'user') {
          this.ctx.scale(-1, 1)
          this.ctx.drawImage(this.video, -this.canvas.width, 0, this.canvas.width, this.canvas.height)
        } else {
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
        }
        
        // Restore context state before applying filters
        this.ctx.restore()
        
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
  
  private async checkAvailableCameras(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.availableCameras = devices.filter(device => device.kind === 'videoinput')
      
      // Show camera switch button if multiple cameras available
      const switchButton = document.getElementById('camera-switch-button')
      if (switchButton && this.availableCameras.length > 1) {
        switchButton.style.display = 'block'
      }
    } catch (error) {
      console.error('Failed to enumerate cameras:', error)
    }
  }

  private setupCameraSwitchButton(): void {
    const switchButton = document.getElementById('camera-switch-button')
    if (switchButton) {
      switchButton.addEventListener('click', () => {
        this.switchCamera()
      })
    }
  }

  private async switchCamera(): Promise<void> {
    if (this.availableCameras.length <= 1) return

    // Stop current stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }

    // Toggle facing mode
    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user'

    // Restart camera with new facing mode
    await this.initCamera()
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