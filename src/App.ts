import { Camera } from './components/Camera'
import { FilterSelector } from './components/FilterSelector'
import { Controls } from './components/Controls'
import { Preview } from './components/Preview'

export class App {
  private camera: Camera
  private filterSelector: FilterSelector
  private controls: Controls
  private preview: Preview
  
  constructor(private container: HTMLElement) {
    this.camera = new Camera()
    this.filterSelector = new FilterSelector()
    this.controls = new Controls()
    this.preview = new Preview()
    
    this.init()
  }
  
  private init(): void {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple">
        <header class="text-center py-4">
          <h1 class="text-4xl font-bold text-pink-600">
            zidorin
            <span class="text-2xl">💕</span>
          </h1>
          <p class="text-pink-500 mt-2">かわいい自撮りカメラ</p>
        </header>
        
        <main class="container mx-auto px-4 pb-8">
          <div class="max-w-4xl mx-auto">
            <div class="relative">
              <div id="camera-container" class="mb-6"></div>
              <div id="controls-container" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"></div>
            </div>
            <div id="filter-container" class="mb-6"></div>
          </div>
        </main>
      </div>
      <div id="preview-container"></div>
    `
    
    const cameraContainer = document.getElementById('camera-container')
    const filterContainer = document.getElementById('filter-container')
    const controlsContainer = document.getElementById('controls-container')
    const previewContainer = document.getElementById('preview-container')
    
    if (cameraContainer && filterContainer && controlsContainer && previewContainer) {
      this.camera.mount(cameraContainer)
      this.filterSelector.mount(filterContainer)
      this.controls.mount(controlsContainer)
      this.preview.mount(previewContainer)
      
      this.setupEventListeners()
    }
  }
  
  private setupEventListeners(): void {
    this.filterSelector.onFilterChange((filterId) => {
      this.camera.setFilter(filterId)
    })
    
    this.controls.onCapture(() => {
      const imageData = this.camera.capture()
      if (imageData) {
        this.preview.show(imageData)
      }
    })
    
    this.preview.onRetake(() => {
      // プレビューを閉じるだけで、カメラは既に動作中
    })
    
    this.preview.onSave(() => {
      // 保存後の処理（必要に応じて）
    })
  }
}