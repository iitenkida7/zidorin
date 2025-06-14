export class Preview {
  private container: HTMLElement | null = null
  private imageData: string | null = null
  private onSaveCallback: (() => void) | null = null
  private onRetakeCallback: (() => void) | null = null
  
  mount(container: HTMLElement): void {
    this.container = container
    this.hide()
  }
  
  show(imageData: string): void {
    this.imageData = imageData
    this.render()
    if (this.container) {
      this.container.style.display = 'block'
    }
  }
  
  hide(): void {
    if (this.container) {
      this.container.style.display = 'none'
    }
  }
  
  private render(): void {
    if (!this.container || !this.imageData) return
    
    this.container.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
          <div class="p-4">
            <h2 class="text-2xl font-bold text-pink-600 text-center mb-4">
              撮影した写真 📸
            </h2>
            <div class="relative rounded-xl overflow-hidden mb-4">
              <img src="${this.imageData}" alt="Preview" class="w-full h-auto" />
            </div>
            <div class="flex gap-3">
              <button
                id="retake-button"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-full font-bold transition-all duration-200"
              >
                撮り直す
              </button>
              <button
                id="save-button"
                class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                保存する 💕
              </button>
              <button
                id="instagram-button"
                class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    
    this.attachEventListeners()
  }
  
  private attachEventListeners(): void {
    const saveButton = document.getElementById('save-button')
    const retakeButton = document.getElementById('retake-button')
    const instagramButton = document.getElementById('instagram-button')
    
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        if (this.imageData) {
          const link = document.createElement('a')
          link.download = `zidorin_${Date.now()}.png`
          link.href = this.imageData
          link.click()
        }
        this.hide()
        if (this.onSaveCallback) {
          this.onSaveCallback()
        }
      })
    }
    
    if (retakeButton) {
      retakeButton.addEventListener('click', () => {
        this.hide()
        if (this.onRetakeCallback) {
          this.onRetakeCallback()
        }
      })
    }
    
    if (instagramButton) {
      instagramButton.addEventListener('click', () => {
        window.open('instagram://camera', '_blank')
      })
    }
  }
  
  onSave(callback: () => void): void {
    this.onSaveCallback = callback
  }
  
  onRetake(callback: () => void): void {
    this.onRetakeCallback = callback
  }
}