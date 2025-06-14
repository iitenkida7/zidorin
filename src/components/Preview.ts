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
            <div class="flex gap-4">
              <button
                id="retake-button"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-bold transition-all duration-200"
              >
                撮り直す
              </button>
              <button
                id="save-button"
                class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                保存する 💕
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
  }
  
  onSave(callback: () => void): void {
    this.onSaveCallback = callback
  }
  
  onRetake(callback: () => void): void {
    this.onRetakeCallback = callback
  }
}