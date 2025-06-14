import { vi } from 'vitest'

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4 * 100 * 100),
    width: 100,
    height: 100,
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4 * 100 * 100),
    width: 100,
    height: 100,
  })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  clip: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  beginPath: vi.fn(),
  arc: vi.fn(),
  ellipse: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn()
  })),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn()
  })),
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  fillStyle: '#000000',
  strokeStyle: '#000000',
  lineWidth: 1,
  font: '10px sans-serif',
})

// Mock MediaDevices API
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getVideoTracks: vi.fn().mockReturnValue([{
        stop: vi.fn(),
      }]),
    }),
  },
})

// Mock HTMLVideoElement
HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined)
HTMLVideoElement.prototype.pause = vi.fn()

// Mock TensorFlow.js models
vi.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: vi.fn(),
  browser: {
    fromPixels: vi.fn(),
  },
}))

vi.mock('@tensorflow-models/face-landmarks-detection', () => ({
  load: vi.fn().mockResolvedValue({
    estimateFaces: vi.fn().mockResolvedValue([]),
  }),
  createDetector: vi.fn().mockResolvedValue({
    estimateFaces: vi.fn().mockResolvedValue([]),
  }),
  SupportedModels: {
    MediaPipeFaceMesh: 'MediaPipeFaceMesh',
  },
}))

vi.mock('@tensorflow-models/body-segmentation', () => ({
  load: vi.fn().mockResolvedValue({
    segmentPeople: vi.fn().mockResolvedValue([]),
  }),
  createSegmenter: vi.fn().mockResolvedValue({
    segmentPeople: vi.fn().mockResolvedValue([]),
  }),
  SupportedModels: {
    MediaPipeSelfieSegmentation: 'MediaPipeSelfieSegmentation',
  },
}))