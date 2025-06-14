import { describe, it, expect } from 'vitest'
import { getFilter, getAllFilters } from '@/filters'

describe('Filters Index', () => {
  it('should export getFilter function', () => {
    expect(typeof getFilter).toBe('function')
  })

  it('should export getAllFilters function', () => {
    expect(typeof getAllFilters).toBe('function')
  })

  it('should return all available filters', () => {
    const filters = getAllFilters()
    
    expect(filters).toHaveLength(45) // 合計45個のフィルター (9 original + 35 new + 1 none filter)
    
    // 基本フィルターのIDをチェック
    const filterIds = filters.map(f => f.id)
    expect(filterIds).toContain('none')
    expect(filterIds).toContain('monochrome')
    expect(filterIds).toContain('vivid')
    expect(filterIds).toContain('cloud')
    expect(filterIds).toContain('sparkle')
    expect(filterIds).toContain('dogface')
    expect(filterIds).toContain('eyesemoji')
    expect(filterIds).toContain('makeup')
    expect(filterIds).toContain('background')
    expect(filterIds).toContain('agegender')
    
    // 新しいフィルターのIDもチェック
    expect(filterIds).toContain('rainbow')
    expect(filterIds).toContain('neon')
    expect(filterIds).toContain('confetti')
    expect(filterIds).toContain('sakura')
    expect(filterIds).toContain('angelhalo')
    expect(filterIds).toContain('catears')
    expect(filterIds).toContain('galaxy')
    expect(filterIds).toContain('emotion')
  })

  it('should return correct filter by id', () => {
    const noneFilter = getFilter('none')
    expect(noneFilter).toBeDefined()
    expect(noneFilter?.id).toBe('none')
    expect(noneFilter?.name).toBe('なし')
    expect(noneFilter?.icon).toBe('🎨')

    const monochromeFilter = getFilter('monochrome')
    expect(monochromeFilter).toBeDefined()
    expect(monochromeFilter?.id).toBe('monochrome')
    expect(monochromeFilter?.name).toBe('モノクロ')
    expect(monochromeFilter?.icon).toBe('⚫')
  })

  it('should return undefined for non-existent filter', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nonExistentFilter = getFilter('nonexistent' as any)
    expect(nonExistentFilter).toBeUndefined()
  })

  it('should have all filters with required properties', () => {
    const filters = getAllFilters()
    
    filters.forEach(filter => {
      expect(filter).toHaveProperty('id')
      expect(filter).toHaveProperty('name')
      expect(filter).toHaveProperty('icon')
      expect(filter).toHaveProperty('category')
      expect(filter).toHaveProperty('apply')
      
      expect(typeof filter.id).toBe('string')
      expect(typeof filter.name).toBe('string')
      expect(typeof filter.icon).toBe('string')
      expect(typeof filter.category).toBe('string')
      expect(typeof filter.apply).toBe('function')
      
      expect(filter.id.length).toBeGreaterThan(0)
      expect(filter.name.length).toBeGreaterThan(0)
      expect(filter.icon.length).toBeGreaterThan(0)
      expect(filter.category.length).toBeGreaterThan(0)
    })
  })

  it('should have unique filter ids', () => {
    const filters = getAllFilters()
    const ids = filters.map(f => f.id)
    const uniqueIds = [...new Set(ids)]
    
    expect(ids.length).toBe(uniqueIds.length)
  })

  it('should have none filter as first filter', () => {
    const filters = getAllFilters()
    
    expect(filters[0].id).toBe('none')
    expect(filters[0].name).toBe('なし')
  })

  it('should include all filter classes', () => {
    const filters = getAllFilters()
    
    // class-based フィルターが正しくインスタンス化されていることを確認
    const classBasedFilters = filters.slice(1) // 'none'を除く
    
    expect(classBasedFilters.length).toBeGreaterThan(0)
    classBasedFilters.forEach(filter => {
      expect(typeof filter.apply).toBe('function')
    })
  })

  it('should have filters with proper emoji icons', () => {
    const filters = getAllFilters()
    
    filters.forEach(filter => {
      // アイコンが絵文字またはUnicodeシンボルであることを確認  
      expect(filter.icon).toMatch(/[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2700}-\u{27BF}]|⚫|🎨/u)
    })
  })
})