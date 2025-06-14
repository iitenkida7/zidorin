import { Camera } from './components/Camera'
import { FilterSelector } from './components/FilterSelector'
import { Controls } from './components/Controls'

export class App {
  private camera: Camera
  private filterSelector: FilterSelector
  private controls: Controls
  
  constructor(private container: HTMLElement) {
    this.camera = new Camera()
    this.filterSelector = new FilterSelector()
    this.controls = new Controls()
    
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
            <div id="camera-container" class="mb-6"></div>
            <div id="filter-container" class="mb-6"></div>
            <div id="controls-container"></div>
          </div>
        </main>
      </div>
    `
    
    const cameraContainer = document.getElementById('camera-container')
    const filterContainer = document.getElementById('filter-container')
    const controlsContainer = document.getElementById('controls-container')
    
    if (cameraContainer && filterContainer && controlsContainer) {
      this.camera.mount(cameraContainer)
      this.filterSelector.mount(filterContainer)
      this.controls.mount(controlsContainer)
      
      this.setupEventListeners()
    }
  }
  
  private setupEventListeners(): void {
    this.filterSelector.onFilterChange((filterId) => {
      this.camera.setFilter(filterId)
    })
    
    this.controls.onCapture(() => {
      this.camera.capture()
    })
  }
}