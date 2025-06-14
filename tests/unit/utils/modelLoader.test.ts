import { describe, it, expect, beforeEach, vi } from 'vitest'
import { modelLoader } from '@/utils/modelLoader'

// TensorFlow.jsのモックを設定
vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn().mockResolvedValue(undefined),
  getBackend: vi.fn().mockReturnValue('webgl'),
  setBackend: vi.fn().mockResolvedValue(undefined),
  env: vi.fn(() => ({
    set: vi.fn()
  }))
}))

vi.mock('@tensorflow-models/face-landmarks-detection', () => ({
  createDetector: vi.fn(),
  SupportedModels: {
    MediaPipeFaceMesh: 'MediaPipeFaceMesh',
  },
}))

vi.mock('@tensorflow-models/body-segmentation', () => ({
  createSegmenter: vi.fn(),
  SupportedModels: {
    MediaPipeSelfieSegmentation: 'MediaPipeSelfieSegmentation',
  },
}))

describe('ModelLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // modelLoaderのキャッシュをクリア
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(modelLoader as any).models = {
      faceDetector: null,
      segmenter: null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(modelLoader as any).faceDetectorPromise = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(modelLoader as any).segmenterPromise = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(modelLoader as any).initialized = false
  })

  it('should load face detector', async () => {
    const mockFaceDetector = { estimateFaces: vi.fn() }
    const faceLandmarksDetection = await import('@tensorflow-models/face-landmarks-detection')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(faceLandmarksDetection.createDetector).mockResolvedValue(mockFaceDetector as any)

    const faceDetector = await modelLoader.getFaceDetector()

    expect(faceLandmarksDetection.createDetector).toHaveBeenCalledWith(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      expect.objectContaining({
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      })
    )
    expect(faceDetector).toBe(mockFaceDetector)
  })

  it('should load segmenter', async () => {
    const mockSegmenter = { segmentPeople: vi.fn() }
    const bodySegmentation = await import('@tensorflow-models/body-segmentation')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(bodySegmentation.createSegmenter).mockResolvedValue(mockSegmenter as any)

    const segmenter = await modelLoader.getSegmenter()

    expect(bodySegmentation.createSegmenter).toHaveBeenCalledWith(
      bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
      expect.objectContaining({
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
      })
    )
    expect(segmenter).toBe(mockSegmenter)
  })

  it('should cache loaded models', async () => {
    const mockFaceDetector = { estimateFaces: vi.fn() }
    const faceLandmarksDetection = await import('@tensorflow-models/face-landmarks-detection')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(faceLandmarksDetection.createDetector).mockResolvedValue(mockFaceDetector as any)

    // 最初の呼び出し
    const faceDetector1 = await modelLoader.getFaceDetector()
    // 2回目の呼び出し
    const faceDetector2 = await modelLoader.getFaceDetector()

    // createDetectorが1回だけ呼ばれていることを確認（キャッシュされている）
    expect(faceLandmarksDetection.createDetector).toHaveBeenCalledTimes(1)
    expect(faceDetector1).toBe(faceDetector2)
  })

  it('should handle loading errors gracefully', async () => {
    const faceLandmarksDetection = await import('@tensorflow-models/face-landmarks-detection')
    vi.mocked(faceLandmarksDetection.createDetector).mockRejectedValueOnce(new Error('Model loading failed'))

    await expect(modelLoader.getFaceDetector()).rejects.toThrow('Model loading failed')
  })
})