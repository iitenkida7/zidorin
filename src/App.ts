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
      <div class="h-screen bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-purple flex flex-col overflow-hidden">
        <header id="header" class="text-center py-4 flex-shrink-0 transition-all duration-300">
          <h1 id="title" class="text-4xl font-bold text-pink-600 transition-all duration-300">
            zidorin
            <span class="text-2xl">💕</span>
          </h1>
          <p id="subtitle" class="text-pink-500 mt-2 transition-all duration-300">かわいい自撮りカメラ</p>
        </header>
        
        <main class="flex-1 flex flex-col overflow-hidden px-4">
          <div class="max-w-4xl mx-auto w-full flex-1 flex flex-col overflow-hidden">
            <div class="relative flex-shrink-0 mb-4">
              <div id="camera-container"></div>
              <div id="controls-container" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"></div>
            </div>
            <div id="filter-container" class="flex-1 overflow-hidden"></div>
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
    const filterContainer = document.getElementById('filter-container')
    const header = document.getElementById('header')
    const title = document.getElementById('title')
    const subtitle = document.getElementById('subtitle')
    
    if (!filterContainer || !header || !title || !subtitle) return
    
    // フィルターコンテナ内のスクロール可能な要素を取得
    const scrollableElement = filterContainer.querySelector('.overflow-y-auto') as HTMLElement
    
    if (!scrollableElement) return
    
    scrollableElement.addEventListener('scroll', () => {
      const scrollTop = scrollableElement.scrollTop
      const isScrolled = scrollTop > 20
      
      if (isScrolled) {
        // コンパクト表示
        header.className = 'text-center py-2 flex-shrink-0 transition-all duration-300'
        title.className = 'text-2xl font-bold text-pink-600 transition-all duration-300'
        subtitle.style.display = 'none'
      } else {
        // 通常表示
        header.className = 'text-center py-4 flex-shrink-0 transition-all duration-300'
        title.className = 'text-4xl font-bold text-pink-600 transition-all duration-300'
        subtitle.style.display = 'block'
      }
    })
  }
}