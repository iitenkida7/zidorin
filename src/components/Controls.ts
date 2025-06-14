export class Controls {
  private container: HTMLElement | null = null
  private onCaptureCallback: (() => void) | null = null
  
  mount(container: HTMLElement): void {
    this.container = container
    this.render()
  }
  
  private render(): void {
    if (!this.container) return
    
    this.container.innerHTML = `
      <div class="flex justify-center">
        <button
          id="capture-button"
          class="group relative bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">撮影する</span>
          </span>
          <span class="absolute -top-1 -right-1 flex h-2 w-2 sm:h-3 sm:w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-pink-500"></span>
          </span>
        </button>
      </div>
    `
    
    this.attachEventListeners()
  }
  
  private attachEventListeners(): void {
    const captureButton = document.getElementById('capture-button')
    
    if (captureButton) {
      captureButton.addEventListener('click', () => {
        if (this.onCaptureCallback) {
          this.onCaptureCallback()
        }
      })
    }
  }
  
  onCapture(callback: () => void): void {
    this.onCaptureCallback = callback
  }
}