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
        <header id="header" class="fixed top-0 left-0 right-0 z-20 bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple text-center py-4 transition-all duration-300">
          <h1 id="title" class="text-4xl font-bold text-pink-600 transition-all duration-300">
            zidorin
            <span class="text-2xl">💕</span>
          </h1>
          <p id="subtitle" class="text-pink-500 mt-2 transition-all duration-300">かわいい自撮りカメラ</p>
        </header>
        
        <div id="camera-section" class="fixed top-20 left-0 right-0 z-10 px-4">
          <div class="max-w-4xl mx-auto">
            <div class="relative">
              <div id="camera-container" class="h-96"></div>
              <div id="controls-container" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"></div>
            </div>
          </div>
        </div>
        
        <main class="pt-[500px] px-4 pb-8">
          <div class="max-w-4xl mx-auto w-full">
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
      this.setupScrollListener()
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
  
  private setupScrollListener(): void {
    const header = document.getElementById('header')
    const title = document.getElementById('title')
    const subtitle = document.getElementById('subtitle')
    
    if (!header || !title || !subtitle) return
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const isScrolled = scrollTop > 20
      
      const cameraSection = document.getElementById('camera-section')
      
      if (isScrolled) {
        // コンパクト表示
        header.className = 'fixed top-0 left-0 right-0 z-20 bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple text-center py-2 transition-all duration-300'
        title.className = 'text-2xl font-bold text-pink-600 transition-all duration-300'
        subtitle.style.display = 'none'
        if (cameraSection) {
          cameraSection.className = 'fixed top-16 left-0 right-0 z-10 px-4'
        }
      } else {
        // 通常表示
        header.className = 'fixed top-0 left-0 right-0 z-20 bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple text-center py-4 transition-all duration-300'
        title.className = 'text-4xl font-bold text-pink-600 transition-all duration-300'
        subtitle.style.display = 'block'
        if (cameraSection) {
          cameraSection.className = 'fixed top-20 left-0 right-0 z-10 px-4'
        }
      }
    })
  }
}