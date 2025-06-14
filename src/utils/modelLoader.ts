import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as bodySegmentation from '@tensorflow-models/body-segmentation'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'
import '@mediapipe/face_mesh'
import '@mediapipe/selfie_segmentation'
import type { FaceDetector, BodySegmenter } from '../types/tensorflow'

// Detect if we're on iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

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
  private initialized = false

  private async initTensorFlow(): Promise<void> {
    if (this.initialized) return
    
    try {
      // Set backend based on device capabilities
      if (isIOS) {
        // For iOS, prefer WebGL but fall back to CPU if needed
        await tf.ready()
        const webglSupported = tf.getBackend() === 'webgl'
        if (!webglSupported) {
          console.warn('WebGL not available on iOS, using CPU backend')
          await tf.setBackend('cpu')
        } else {
          // Configure WebGL for iOS
          tf.env().set('WEBGL_PACK', false)
          tf.env().set('WEBGL_FORCE_F16_TEXTURES', false)
        }
      } else {
        await tf.ready()
      }
      
      this.initialized = true
      console.log('TensorFlow.js initialized with backend:', tf.getBackend())
    } catch (error) {
      console.error('TensorFlow.js initialization failed:', error)
      // Fallback to CPU backend
      await tf.setBackend('cpu')
      await tf.ready()
      this.initialized = true
    }
  }
  
  async getFaceDetector(): Promise<FaceDetector> {
    await this.initTensorFlow()
    
    if (this.models.faceDetector) {
      return this.models.faceDetector
    }
    
    if (!this.faceDetectorPromise) {
      this.faceDetectorPromise = this.loadFaceDetector()
    }
    
    return this.faceDetectorPromise
  }
  
  private async loadFaceDetector(): Promise<FaceDetector> {
    try {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: !isIOS, // Disable refined landmarks on iOS for performance
        maxFaces: 1
      }
      
      console.log('Loading face detector for iOS:', isIOS)
      this.models.faceDetector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      console.log('Face detector loaded successfully')
      return this.models.faceDetector
    } catch (error) {
      console.error('Face detector loading failed:', error)
      throw error
    }
  }
  
  async getSegmenter(): Promise<BodySegmenter> {
    await this.initTensorFlow()
    
    if (this.models.segmenter) {
      return this.models.segmenter
    }
    
    if (!this.segmenterPromise) {
      this.segmenterPromise = this.loadSegmenter()
    }
    
    return this.segmenterPromise
  }
  
  private async loadSegmenter(): Promise<BodySegmenter> {
    try {
      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation
      const segmenterConfig: bodySegmentation.MediaPipeSelfieSegmentationMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        modelType: isIOS ? 'landscape' : 'general' // Use lighter model on iOS
      }
      
      console.log('Loading body segmenter for iOS:', isIOS)
      this.models.segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig)
      console.log('Body segmenter loaded successfully')
      return this.models.segmenter
    } catch (error) {
      console.error('Body segmenter loading failed:', error)
      throw error
    }
  }
}

export const modelLoader = new ModelLoader()