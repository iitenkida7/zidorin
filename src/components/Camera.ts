import { FilterId } from '../types/filter'
import { getFilter } from '../filters'

export class Camera {
  private container: HTMLElement | null = null
  private video: HTMLVideoElement | null = null
  private displayCanvas: HTMLCanvasElement | null = null // For preview display
  private captureCanvas: HTMLCanvasElement | null = null // For photo capture
  private displayCtx: CanvasRenderingContext2D | null = null
  private captureCtx: CanvasRenderingContext2D | null = null
  private stream: MediaStream | null = null
  private currentFilter: FilterId = 'none'
  private animationId: number | null = null
  private currentFacingMode: 'user' | 'environment' = 'user'
  private availableCameras: MediaDeviceInfo[] = []
  
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
          id="camera-display-canvas"
          class="w-full h-full object-cover"
        ></canvas>
        <canvas
          id="camera-capture-canvas"
          class="w-full h-full object-cover"
          style="display: none;"
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
    this.displayCanvas = document.getElementById('camera-display-canvas') as HTMLCanvasElement
    this.captureCanvas = document.getElementById('camera-capture-canvas') as HTMLCanvasElement
    this.displayCtx = this.displayCanvas.getContext('2d')
    this.captureCtx = this.captureCanvas.getContext('2d')
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
            // Check available cameras after successful camera init
            this.checkAvailableCameras()
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
    if (!this.video || !this.displayCanvas || !this.captureCanvas) return
    
    // Setup both canvases with same dimensions
    this.displayCanvas.width = this.video.videoWidth
    this.displayCanvas.height = this.video.videoHeight
    this.captureCanvas.width = this.video.videoWidth
    this.captureCanvas.height = this.video.videoHeight
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
      if (!this.video || !this.displayCanvas || !this.captureCanvas || !this.displayCtx || !this.captureCtx) return
      
      // Throttle rendering for iOS performance
      if (currentTime - lastFrameTime < frameInterval) {
        this.animationId = requestAnimationFrame(render)
        return
      }
      
      lastFrameTime = currentTime
      
      // Check if video is ready
      if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
        // Draw to both canvases
        this.drawToCanvas(this.displayCtx, this.displayCanvas, true) // For display with filter
        this.drawToCanvas(this.captureCtx, this.captureCanvas, false) // For capture without spy filter
      }
      
      this.animationId = requestAnimationFrame(render)
    }
    
    this.animationId = requestAnimationFrame(render)
  }

  private async drawToCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, applySpyEffect: boolean): Promise<void> {
    if (!this.video) return
    
    // Save context state
    ctx.save()
    
    // Mirror the canvas for front-facing camera
    if (this.currentFacingMode === 'user') {
      ctx.scale(-1, 1)
      ctx.drawImage(this.video, -canvas.width, 0, canvas.width, canvas.height)
    } else {
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
    }
    
    // Restore context state before applying filters
    ctx.restore()
    
    const filter = getFilter(this.currentFilter)
    if (filter) {
      try {
        // For spy camera: only apply spy effect to display canvas
        if (this.currentFilter === 'spy' && !applySpyEffect) {
          // Skip spy filter for capture canvas
          return
        }
        await filter.apply(ctx, canvas.width, canvas.height)
      } catch (error) {
        console.error('Filter application failed:', error)
      }
    }
  }
  
  setFilter(filterId: FilterId): void {
    this.currentFilter = filterId
  }
  
  capture(): string | null {
    if (!this.captureCanvas) return null
    
    // Always capture from the capture canvas (without spy effect)
    return this.captureCanvas.toDataURL('image/png')
  }
  
  private async checkAvailableCameras(): Promise<void> {
    try {
      // On iOS, need camera permission first before enumerateDevices returns device labels
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.availableCameras = devices.filter(device => device.kind === 'videoinput')
      
      console.log('Available cameras:', this.availableCameras.length, this.availableCameras)
      
      // Detect if we're on mobile device (likely has multiple cameras)
      const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      
      // Show camera switch button if multiple cameras available OR on mobile with at least one camera
      const switchButton = document.getElementById('camera-switch-button')
      if (switchButton) {
        const shouldShowButton = this.availableCameras.length > 1 || 
          (isMobile && this.availableCameras.length >= 1)
        
        if (shouldShowButton) {
          console.log('Showing camera switch button (mobile device detected)')
          switchButton.style.display = 'block'
        } else {
          console.log('Only one camera available, hiding switch button')
          switchButton.style.display = 'none'
        }
      } else {
        console.error('Camera switch button element not found')
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
    console.log('Switching camera, current mode:', this.currentFacingMode)
    
    // Try to switch even if we only detected one camera (mobile fallback)
    const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    
    if (!isMobile && this.availableCameras.length <= 1) {
      console.log('Not switching camera: only one camera available on desktop')
      return
    }

    try {
      // Stop current stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }

      // Toggle facing mode
      const newFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user'
      console.log('Switching to facing mode:', newFacingMode)
      this.currentFacingMode = newFacingMode

      // Restart camera with new facing mode
      await this.initCamera()
    } catch (error) {
      console.error('Failed to switch camera:', error)
      // If switching fails, revert to previous mode
      this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user'
    }
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