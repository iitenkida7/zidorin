import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as bodySegmentation from '@tensorflow-models/body-segmentation'
import '@tensorflow/tfjs-backend-webgl'
import '@mediapipe/face_mesh'
import '@mediapipe/selfie_segmentation'
import type { FaceDetector, BodySegmenter } from '../types/tensorflow'

export interface Models {
  faceDetector: FaceDetector | null
  segmenter: BodySegmenter | null
}

class ModelLoader {
  private models: Models = {
    faceDetector: null,
    segmenter: null
  }
  
  private faceDetectorPromise: Promise<FaceDetector> | null = null
  private segmenterPromise: Promise<BodySegmenter> | null = null
  
  async getFaceDetector(): Promise<FaceDetector> {
    if (this.models.faceDetector) {
      return this.models.faceDetector
    }
    
    if (!this.faceDetectorPromise) {
      this.faceDetectorPromise = this.loadFaceDetector()
    }
    
    return this.faceDetectorPromise
  }
  
  private async loadFaceDetector(): Promise<FaceDetector> {
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
  
  async getSegmenter(): Promise<BodySegmenter> {
    if (this.models.segmenter) {
      return this.models.segmenter
    }
    
    if (!this.segmenterPromise) {
      this.segmenterPromise = this.loadSegmenter()
    }
    
    return this.segmenterPromise
  }
  
  private async loadSegmenter(): Promise<BodySegmenter> {
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