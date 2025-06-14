import { Filter, FilterId } from '../types/filter'
import { MonochromeFilter } from './monochrome'
import { VividFilter } from './vivid'
import { CloudFilter } from './cloud'
import { SparkleFilter } from './sparkle'

const filters: Filter[] = [
  {
    id: 'none',
    name: 'なし',
    icon: '🎨',
    apply: () => {}
  },
  new MonochromeFilter(),
  new VividFilter(),
  new CloudFilter(),
  new SparkleFilter(),
]

export function getFilter(id: FilterId): Filter | undefined {
  return filters.find(filter => filter.id === id)
}

export function getAllFilters(): Filter[] {
  return filters
}