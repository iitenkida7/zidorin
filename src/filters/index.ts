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

// New color filters
import { RainbowFilter } from './rainbow'
import { NeonFilter } from './neon'
import { VintageFilter } from './vintage'
import { ThermalFilter } from './thermal'
import { CyberpunkFilter } from './cyberpunk'
import { PastelFilter } from './pastel'
import { SepiaFilter } from './sepia'
import { CoolFilter } from './cool'
import { WarmFilter } from './warm'
import { DreamyFilter } from './dreamy'
import { SunsetFilter } from './sunset'
import { OceanFilter } from './ocean'
import { CherryFilter } from './cherry'
import { EmeraldFilter } from './emerald'
import { LavenderFilter } from './lavender'

// New decorate filters
import { ConfettiFilter } from './confetti'
import { SakuraFilter } from './sakura'
import { MatrixFilter } from './matrix'
import { BubbleFilter } from './bubble'
import { SnowFilter } from './snow'

// New face filters
import { AngelHaloFilter } from './angelHalo'
import { RobotEyesFilter } from './robotEyes'
import { CatEarsFilter } from './catEars'
import { CrownFilter } from './crown'
import { MagicCircleFilter } from './magicCircle'

// New background filters
import { GalaxyBackgroundFilter } from './galaxyBackground'
import { UnderwaterBackgroundFilter } from './underwaterBackground'
import { CityNightFilter } from './cityNight'
import { ForestMagicFilter } from './forestMagic'
import { RetroWaveFilter } from './retroWave'

// New special filters
import { EmotionDetectorFilter } from './emotionDetector'
import { ColorPaletteFilter } from './colorPalette'
import { MotionTrackerFilter } from './motionTracker'
import { ObjectDetectorFilter } from './objectDetector'
import { AIArtistFilter } from './aiArtist'

const filters: Filter[] = [
  {
    id: 'none',
    name: 'なし',
    icon: '🎨',
    category: 'basic' as FilterCategory,
    apply: () => { }
  },
  // Original filters
  new MonochromeFilter(),
  new VividFilter(),
  new CloudFilter(),
  new SparkleFilter(),
  new DogFaceFilter(),
  new EyesEmojiFilter(),
  new MakeupFilter(),
  new BackgroundReplaceFilter(),
  new AgeGenderFilter(),
  
  // New color filters
  new RainbowFilter(),
  new NeonFilter(),
  new VintageFilter(),
  new ThermalFilter(),
  new CyberpunkFilter(),
  new PastelFilter(),
  new SepiaFilter(),
  new CoolFilter(),
  new WarmFilter(),
  new DreamyFilter(),
  new SunsetFilter(),
  new OceanFilter(),
  new CherryFilter(),
  new EmeraldFilter(),
  new LavenderFilter(),
  
  // New decorate filters
  new ConfettiFilter(),
  new SakuraFilter(),
  new MatrixFilter(),
  new BubbleFilter(),
  new SnowFilter(),
  
  // New face filters
  new AngelHaloFilter(),
  new RobotEyesFilter(),
  new CatEarsFilter(),
  new CrownFilter(),
  new MagicCircleFilter(),
  
  // New background filters
  new GalaxyBackgroundFilter(),
  new UnderwaterBackgroundFilter(),
  new CityNightFilter(),
  new ForestMagicFilter(),
  new RetroWaveFilter(),
  
  // New special filters
  new EmotionDetectorFilter(),
  new ColorPaletteFilter(),
  new MotionTrackerFilter(),
  new ObjectDetectorFilter(),
  new AIArtistFilter(),
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
