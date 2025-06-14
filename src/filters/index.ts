import { Filter, FilterId } from '../types/filter'
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
