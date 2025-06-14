import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FilterSelector } from '@/components/FilterSelector'

// Mockの設定
vi.mock('@/filters', () => ({
  getAllFilters: vi.fn(() => [
    { id: 'none', name: 'なし', icon: '🎨', apply: vi.fn() },
    { id: 'monochrome', name: 'モノクロ', icon: '🖤', apply: vi.fn() },
    { id: 'vivid', name: 'ビビッド', icon: '🌈', apply: vi.fn() },
  ])
}))

describe('FilterSelector', () => {
  let filterSelector: FilterSelector
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    filterSelector = new FilterSelector()
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should mount and render filter buttons', () => {
    filterSelector.mount(container)

    const buttons = container.querySelectorAll('.filter-button')
    expect(buttons).toHaveLength(3)

    // フィルターボタンのアイコンとテキストをチェック
    const noneButton = container.querySelector('[data-filter-id=\"none\"]')
    expect(noneButton).toBeTruthy()
    expect(noneButton?.textContent).toContain('🎨')
    expect(noneButton?.textContent).toContain('なし')
  })

  it('should handle filter selection', () => {
    const onChangeMock = vi.fn()
    filterSelector.onFilterChange(onChangeMock)
    filterSelector.mount(container)

    const monochromeButton = container.querySelector('[data-filter-id=\"monochrome\"]') as HTMLElement
    expect(monochromeButton).toBeTruthy()

    monochromeButton.click()

    expect(onChangeMock).toHaveBeenCalledWith('monochrome')
  })

  it('should show and hide loading indicator', () => {
    filterSelector.mount(container)

    filterSelector.showLoading('monochrome')
    const loadingElement = document.getElementById('loading-monochrome')
    expect(loadingElement?.style.display).toBe('flex')

    filterSelector.hideLoading('monochrome')
    expect(loadingElement?.style.display).toBe('none')
  })

  it('should not show loading for \"none\" filter', () => {
    filterSelector.mount(container)

    filterSelector.showLoading('none')
    const loadingElement = document.getElementById('loading-none')
    // noneフィルターのローディング要素は存在するが表示されないことをチェック
    expect(loadingElement?.style.display).toBe('none')
  })

  it('should update selected state when filter changes', () => {
    const onChangeMock = vi.fn()
    filterSelector.onFilterChange(onChangeMock)
    filterSelector.mount(container)

    const monochromeButton = container.querySelector('[data-filter-id=\"monochrome\"]') as HTMLElement
    monochromeButton.click()

    // onChangeが呼ばれることを確認
    expect(onChangeMock).toHaveBeenCalledWith('monochrome')
    
    // 選択状態のクラスが適用されていることを確認
    const updatedButton = container.querySelector('[data-filter-id=\"monochrome\"]') as HTMLElement
    expect(updatedButton.className).toContain('border-pink-500')
  })
})