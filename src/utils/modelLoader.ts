import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as bodySegmentation from '@tensorflow-models/body-segmentation'
import '@tensorflow/tfjs-backend-webgl'
import '@mediapipe/face_mesh'
import '@mediapipe/selfie_segmentation'

export interface Models {
  faceDetector: faceLandmarksDetection.FaceLandmarksDetector | null
  segmenter: bodySegmentation.BodySegmenter | null
}

class ModelLoader {
  private models: Models = {
    faceDetector: null,
    segmenter: null
  }
  
  private loadingPromises: Map<string, Promise<any>> = new Map()
  
  async getFaceDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
    if (this.models.faceDetector) {
      return this.models.faceDetector
    }
    
    const key = 'faceDetector'
    if (!this.loadingPromises.has(key)) {
      const promise = this.loadFaceDetector()
      this.loadingPromises.set(key, promise)
    }
    
    return this.loadingPromises.get(key)!
  }
  
  private async loadFaceDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      refineLandmarks: true,
      maxFaces: 1
    }
    
    this.models.faceDetector = await faceLandmarksDetection.createDetector(model, detectorConfig)
    return this.models.faceDetector
  }
  
  async getSegmenter(): Promise<bodySegmentation.BodySegmenter> {
    if (this.models.segmenter) {
      return this.models.segmenter
    }
    
    const key = 'segmenter'
    if (!this.loadingPromises.has(key)) {
      const promise = this.loadSegmenter()
      this.loadingPromises.set(key, promise)
    }
    
    return this.loadingPromises.get(key)!
  }
  
  private async loadSegmenter(): Promise<bodySegmentation.BodySegmenter> {
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation
    const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationMediaPipeModelConfig = {
      runtime: 'mediapipe',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
      modelType: 'general'
    }
    
    this.models.segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig)
    return this.models.segmenter
  }
}

export const modelLoader = new ModelLoader()