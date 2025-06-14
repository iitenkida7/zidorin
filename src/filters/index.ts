import { Filter, FilterId, FilterCategory } from '../types/filter'
import { MonochromeFilter } from './monochrome'
import { VividFilter } from './vivid'
import { CloudFilter } from './cloud'
import { SparkleFilter } from './sparkle'
import { DogFaceFilter } from './dogFace'
import { EyesEmojiFilter } from './eyesEmoji'
import { MakeupFilter } from './makeup'
import { BackgroundReplaceFilter } from './backgroundReplace'
import { AgeGenderFilter } from './ageGender'

const filters: Filter[] = [
  {
    id: 'none',
    name: 'なし',
    icon: '🎨',
    category: 'basic' as FilterCategory,
    apply: () => { }
  },
  new MonochromeFilter(),
  new VividFilter(),
  new CloudFilter(),
  new SparkleFilter(),
  new DogFaceFilter(),
  new EyesEmojiFilter(),
  new MakeupFilter(),
  new BackgroundReplaceFilter(),
  new AgeGenderFilter(),
]

export function getFilter(id: FilterId): Filter | undefined {
  return filters.find(filter => filter.id === id)
}

export function getAllFilters(): Filter[] {
  return filters
}

export function getFiltersByCategory(category: FilterCategory): Filter[] {
  return filters.filter(filter => filter.category === category)
}

export function getCategorizedFilters(): Map<FilterCategory, Filter[]> {
  const categorized = new Map<FilterCategory, Filter[]>()
  
  filters.forEach(filter => {
    const category = filter.category
    if (!categorized.has(category)) {
      categorized.set(category, [])
    }
    categorized.get(category)!.push(filter)
  })
  
  return categorized
}
