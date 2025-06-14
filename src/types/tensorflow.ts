// TensorFlow.js関連の型定義

export interface FaceKeypoint {
  x: number
  y: number
  z?: number
}

export interface FaceBoundingBox {
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  width: number
  height: number
}

export interface Face {
  keypoints: FaceKeypoint[]
  box?: FaceBoundingBox
}

export interface FaceDetector {
  estimateFaces: (input: HTMLCanvasElement | HTMLVideoElement | ImageData) => Promise<Face[]>
}

export interface SegmentationMask {
  getUnderlyingCanvas?: () => HTMLCanvasElement
  toImageData?: () => Promise<ImageData>
}

export interface Segmentation {
  mask: SegmentationMask
}

export interface BodySegmenter {
  segmentPeople: (
    input: HTMLCanvasElement | HTMLVideoElement | ImageData,
    options?: {
      multiSegmentation?: boolean
      segmentBodyParts?: boolean
      flipHorizontal?: boolean
    }
  ) => Promise<Segmentation[]>
}