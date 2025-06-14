import { FilterId, categoryInfo } from '../types/filter'
import { getCategorizedFilters } from '../filters'

export class FilterSelector {
  private container: HTMLElement | null = null
  private selectedFilter: FilterId = 'none'
  private onChange: ((filterId: FilterId) => void) | null = null
  private loadingFilters: Set<FilterId> = new Set()
  
  mount(container: HTMLElement): void {
    this.container = container
    this.render()
  }
  
  private render(): void {
    if (!this.container) return
    
    const categorizedFilters = getCategorizedFilters()
    const categoryOrder = ['basic', 'color', 'decorate', 'face', 'background', 'special'] as const
    
    this.container.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg">
        <div class="p-3">
          <h2 class="text-sm font-bold text-pink-600 text-center mb-3">フィルターを選ぼう！</h2>
          <div class="space-y-3">
            ${categoryOrder.map(categoryKey => {
              const filters = categorizedFilters.get(categoryKey) || []
              if (filters.length === 0) return ''
              
              const category = categoryInfo[categoryKey]
              return `
                <div class="category-section">
                  <div class="flex items-center mb-2 px-1">
                    <span class="text-base mr-2 drop-shadow-sm">${category.icon}</span>
                    <h3 class="text-xs font-semibold text-gray-700 tracking-wide">${category.name}</h3>
                    <div class="flex-1 ml-2 h-px bg-gradient-to-r from-pink-200 to-transparent"></div>
                  </div>
                  <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
                    ${filters.map(filter => `
                      <button
                        data-filter-id="${filter.id}"
                        class="filter-button relative aspect-square rounded-xl border transition-all duration-200 bg-gradient-to-br from-white to-pink-50 ${
                          filter.id === this.selectedFilter
                            ? 'border-pink-400 scale-105 shadow-lg border-2 from-pink-50 to-pink-100'
                            : 'border-gray-200 hover:border-pink-300 hover:scale-105 border hover:from-pink-25 hover:to-pink-75'
                        }"
                      >
                        <div class="absolute inset-0 flex flex-col items-center justify-center p-0.5 overflow-hidden">
                          <span class="text-sm flex-shrink-0">${filter.icon}</span>
                          <span class="text-xs text-gray-700 leading-tight truncate w-full text-center hidden sm:block">${filter.name}</span>
                        </div>
                        <div id="loading-${filter.id}" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg" style="display: none;">
                          <div class="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent"></div>
                        </div>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `
            }).filter(Boolean).join('')}
          </div>
        </div>
      </div>
    `
    
    this.attachEventListeners()
  }
  
  private attachEventListeners(): void {
    if (!this.container) return
    
    const buttons = this.container.querySelectorAll('.filter-button')
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement
        const filterId = target.dataset.filterId as FilterId
        
        if (filterId && filterId !== this.selectedFilter) {
          this.selectedFilter = filterId
          this.render()
          
          if (this.onChange) {
            this.showLoading(filterId)
            this.onChange(filterId)
          }
        }
      })
    })
  }
  
  onFilterChange(callback: (filterId: FilterId) => void): void {
    this.onChange = callback
  }
  
  showLoading(filterId: FilterId): void {
    if (filterId === 'none') return // 'なし'フィルターはローディング不要
    
    this.loadingFilters.add(filterId)
    const loadingElement = document.getElementById(`loading-${filterId}`)
    if (loadingElement) {
      loadingElement.style.display = 'flex'
    }
  }
  
  hideLoading(filterId: FilterId): void {
    this.loadingFilters.delete(filterId)
    const loadingElement = document.getElementById(`loading-${filterId}`)
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }
  }
}