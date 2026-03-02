# TensorFlow Lite Object Detection Integration

This document describes the integration of TensorFlow Lite SSD MobileNet for car detection with live bounding box rendering in the vehicle photography app.

## Overview

The integration consists of three main components:

1. **Object Detection Hook** (`hooks/useObjectDetection.ts`) - Manages TensorFlow Lite model loading and inference
2. **Bounding Box Overlay** (`components/BoundingBoxOverlay.tsx`) - Renders live bounding boxes using React Native Animated
3. **Camera Integration** (`components/CameraCapture.tsx`) - Integrates detection into the camera view

## Current Implementation Status

### ✅ Completed

- Created type definitions for detection results (`types/detection.ts`)
- Implemented object detection hook with placeholder logic
- Created animated bounding box overlay component
- Integrated detection into CameraCapture component (both landscape and portrait modes)
- Added periodic detection simulation (runs every 500ms)

### 🚧 To Be Implemented

The current implementation uses **mock/placeholder detection** that simulates a car in the center of the frame. To enable real TensorFlow Lite detection, follow these steps:

## Next Steps: Implementing Real TensorFlow Detection

### 1. Install TensorFlow.js Dependencies

```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native @react-native-async-storage/async-storage expo-gl expo-gl-cpp --legacy-peer-deps
```

### 2. Download the SSD MobileNet Model

Download the TensorFlow Lite model files:

```bash
# Create models directory
mkdir -p assets/models

# Download SSD MobileNet v2 COCO model
# Option 1: From TensorFlow Hub
curl -L https://tfhub.dev/tensorflow/lite-model/ssd_mobilenet_v1/1/metadata/1?lite-format=tflite -o assets/models/ssd_mobilenet_v1.tflite

# Option 2: Use a pre-converted model optimized for mobile
# Download from: https://www.tensorflow.org/lite/models/object_detection/overview
```

You'll also need the label map file:
```bash
curl -L https://raw.githubusercontent.com/tensorflow/models/master/research/object_detection/data/mscoco_label_map.pbtxt -o assets/models/labelmap.txt
```

### 3. Update the Object Detection Hook

Replace the placeholder code in `hooks/useObjectDetection.ts` with actual TensorFlow.js implementation:

```typescript
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const loadModel = async () => {
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    
    // Load the model
    const modelJson = require('../assets/models/model.json');
    const modelWeights = require('../assets/models/weights.bin');
    
    const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    modelRef.current = model;
    setIsModelLoaded(true);
  } catch (error) {
    console.error('Error loading model:', error);
  }
};
```

### 4. Implement Frame Processing

For real-time detection, you have two options:

#### Option A: Use Vision Camera Frame Processors (Recommended)

Install the frame processor plugin:
```bash
npm install vision-camera-plugin-tensorflow
```

Then update CameraCapture to use frame processors instead of intervals.

#### Option B: Periodic Snapshot Processing

Keep the current interval-based approach but capture actual frames:

```typescript
const runDetection = async () => {
  if (!cameraRef.current) return;
  
  // Take a snapshot
  const photo = await cameraRef.current.takeSnapshot({
    quality: 50,
    skipMetadata: true,
  });
  
  // Process with TensorFlow
  const result = await detectObjects(photo.path, cameraViewWidth, cameraViewHeight);
  setDetectedCarBbox(result.largestCarBbox);
};
```

### 5. Update App Configuration

Add the model files to your app bundle by updating `app.json`:

```json
{
  "expo": {
    "assetBundlePatterns": [
      "**/*",
      "assets/models/**/*"
    ]
  }
}
```

## Architecture

### Detection Flow

```
Camera Frame → Object Detection Hook → TensorFlow Inference → Bounding Box Calculation → BoundingBoxOverlay Render
```

### Component Hierarchy

```
CameraCapture
├── Camera (react-native-vision-camera)
├── AngleOverlay (car outline guide)
├── BoundingBoxOverlay (detection visualization) ← NEW
└── UI Controls (shutter, angle selector, etc.)
```

## Features

### Bounding Box Overlay

- **Animated pulse effect** - Subtle opacity animation for visual feedback
- **Corner accents** - Enhanced visibility with corner markers
- **Confidence label** - Shows detection class and confidence score
- **Responsive** - Works in both landscape and portrait orientations
- **Performance optimized** - Uses React Native Reanimated for smooth 60fps animations

### Detection Configuration

You can customize detection behavior in `CameraCapture.tsx`:

```typescript
// Toggle bounding box visibility
const [showBoundingBox, setShowBoundingBox] = useState(true);

// Adjust detection frequency (in milliseconds)
detectionIntervalRef.current = setInterval(runDetection, 500);
```

## Performance Considerations

1. **Detection Frequency**: Currently set to 500ms. Adjust based on device performance.
2. **Model Size**: SSD MobileNet is optimized for mobile but still requires ~20MB.
3. **Frame Processing**: Use frame processors for better performance than snapshot-based detection.
4. **Memory Management**: Dispose of tensors properly to avoid memory leaks.

## Troubleshooting

### Model Not Loading
- Ensure model files are in `assets/models/`
- Check that `assetBundlePatterns` includes the models directory
- Verify TensorFlow.js is properly initialized with `await tf.ready()`

### Poor Detection Performance
- Reduce detection frequency
- Use a smaller model variant
- Implement frame skipping
- Consider using quantized models

### Bounding Box Not Showing
- Check that `showBoundingBox` is `true`
- Verify detection is returning valid bounding boxes
- Check console logs for detection results

## References

- [TensorFlow Lite Models](https://www.tensorflow.org/lite/models)
- [TensorFlow.js React Native](https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native)
- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

