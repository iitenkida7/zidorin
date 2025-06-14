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
    apply: () => {}
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
  // ダミーフィルター（30個追加）
  { id: 'dummy1' as any, name: 'キラキラ', icon: '✨', apply: () => {} },
  { id: 'dummy2' as any, name: 'ハート', icon: '💖', apply: () => {} },
  { id: 'dummy3' as any, name: 'ネコ', icon: '🐱', apply: () => {} },
  { id: 'dummy4' as any, name: 'ウサギ', icon: '🐰', apply: () => {} },
  { id: 'dummy5' as any, name: 'クマ', icon: '🐻', apply: () => {} },
  { id: 'dummy6' as any, name: 'パンダ', icon: '🐼', apply: () => {} },
  { id: 'dummy7' as any, name: 'ライオン', icon: '🦁', apply: () => {} },
  { id: 'dummy8' as any, name: 'トラ', icon: '🐯', apply: () => {} },
  { id: 'dummy9' as any, name: 'サル', icon: '🐵', apply: () => {} },
  { id: 'dummy10' as any, name: 'フラワー', icon: '🌸', apply: () => {} },
  { id: 'dummy11' as any, name: 'レインボー', icon: '🌈', apply: () => {} },
  { id: 'dummy12' as any, name: 'サン', icon: '☀️', apply: () => {} },
  { id: 'dummy13' as any, name: 'ムーン', icon: '🌙', apply: () => {} },
  { id: 'dummy14' as any, name: 'スター', icon: '⭐', apply: () => {} },
  { id: 'dummy15' as any, name: 'ファイア', icon: '🔥', apply: () => {} },
  { id: 'dummy16' as any, name: 'アイス', icon: '❄️', apply: () => {} },
  { id: 'dummy17' as any, name: 'リーフ', icon: '🍃', apply: () => {} },
  { id: 'dummy18' as any, name: 'オーシャン', icon: '🌊', apply: () => {} },
  { id: 'dummy19' as any, name: 'マジック', icon: '🪄', apply: () => {} },
  { id: 'dummy20' as any, name: 'プリンセス', icon: '👑', apply: () => {} },
  { id: 'dummy21' as any, name: 'ユニコーン', icon: '🦄', apply: () => {} },
  { id: 'dummy22' as any, name: 'ドラゴン', icon: '🐉', apply: () => {} },
  { id: 'dummy23' as any, name: 'エンジェル', icon: '😇', apply: () => {} },
  { id: 'dummy24' as any, name: 'デビル', icon: '😈', apply: () => {} },
  { id: 'dummy25' as any, name: 'ロボット', icon: '🤖', apply: () => {} },
  { id: 'dummy26' as any, name: 'エイリアン', icon: '👽', apply: () => {} },
  { id: 'dummy27' as any, name: 'ゴースト', icon: '👻', apply: () => {} },
  { id: 'dummy28' as any, name: 'パンプキン', icon: '🎃', apply: () => {} },
  { id: 'dummy29' as any, name: 'スノーマン', icon: '⛄', apply: () => {} },
  { id: 'dummy30' as any, name: 'クリスマス', icon: '🎄', apply: () => {} },
]

export function getFilter(id: FilterId): Filter | undefined {
  return filters.find(filter => filter.id === id)
}

export function getAllFilters(): Filter[] {
  return filters
}