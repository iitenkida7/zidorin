import { FilterId } from '../types/filter'
import { getAllFilters } from '../filters'

export class FilterSelector {
  private container: HTMLElement | null = null
  private selectedFilter: FilterId = 'none'
  private onChange: ((filterId: FilterId) => void) | null = null
  
  mount(container: HTMLElement): void {
    this.container = container
    this.render()
  }
  
  private render(): void {
    if (!this.container) return
    
    const filters = getAllFilters()
    
    this.container.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg">
        <div class="p-2">
          <h2 class="text-xs font-bold text-pink-600 text-center mb-2">フィルターを選ぼう！</h2>
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
            ${filters.map(filter => `
              <button
                data-filter-id="${filter.id}"
                class="filter-button relative aspect-square rounded-lg border transition-all duration-200 ${
                  filter.id === this.selectedFilter
                    ? 'border-pink-500 scale-105 shadow-lg border-2'
                    : 'border-gray-200 hover:border-pink-300 hover:scale-105 border'
                }"
              >
                <div class="absolute inset-0 flex flex-col items-center justify-center p-0.5 overflow-hidden">
                  <span class="text-sm flex-shrink-0">${filter.icon}</span>
                  <span class="text-xs text-gray-700 leading-tight truncate w-full text-center hidden sm:block">${filter.name}</span>
                </div>
              </button>
            `).join('')}
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
            this.onChange(filterId)
          }
        }
      })
    })
  }
  
  onFilterChange(callback: (filterId: FilterId) => void): void {
    this.onChange = callback
  }
}