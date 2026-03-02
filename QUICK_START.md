# Quick Start Guide - Car Detection Feature

## 🎯 What's Been Added

Your vehicle photography app now has a **car detection feature** with live bounding box visualization!

## 🚀 Testing the Feature

### 1. Run the App
```bash
npm start
```

### 2. Open Camera View
- Navigate to the camera screen in your app
- Point camera at any scene

### 3. Toggle Detection
- Look for the **target icon** button:
  - **Landscape mode**: Right side panel (between close and shutter buttons)
  - **Portrait mode**: Bottom bar (right side)
- Tap to enable/disable the bounding box

### 4. What You'll See
- A **blue bounding box** appears in the center of the screen
- The box has a **subtle pulse animation**
- A **label** shows "Car 85%" above the box
- **Corner accents** make the box more visible

> **Note**: Currently shows a mock/simulated detection. Real ML detection requires additional setup (see below).

## 📁 New Files

```
types/
  └── detection.ts                    # Type definitions

hooks/
  └── useObjectDetection.ts           # Detection logic (placeholder)

components/
  └── BoundingBoxOverlay.tsx          # Bounding box visualization

OBJECT_DETECTION_INTEGRATION.md       # Detailed integration guide
IMPLEMENTATION_SUMMARY.md             # Complete implementation details
QUICK_START.md                        # This file
```

## 🔧 How to Enable Real Detection

### Quick Version
1. Install TensorFlow: `npm install @tensorflow/tfjs @tensorflow/tfjs-react-native --legacy-peer-deps`
2. Download model to `assets/models/`
3. Update `hooks/useObjectDetection.ts` with real TensorFlow code
4. See `OBJECT_DETECTION_INTEGRATION.md` for details

### Detailed Version
See `OBJECT_DETECTION_INTEGRATION.md` for step-by-step instructions.

## 🎨 Customization

### Change Detection Frequency
In `components/CameraCapture.tsx`:
```typescript
// Change from 500ms to your preferred interval
detectionIntervalRef.current = setInterval(runDetection, 500);
```

### Change Bounding Box Color
In `components/BoundingBoxOverlay.tsx`:
```typescript
// Change from blue to your preferred color
borderColor: '#60A5FA',  // Change this
```

### Disable by Default
In `components/CameraCapture.tsx`:
```typescript
// Change from true to false
const [showBoundingBox, setShowBoundingBox] = useState(false);
```

## 🐛 Troubleshooting

### Bounding Box Not Showing
1. Check that toggle button is active (blue highlight)
2. Verify `showBoundingBox` state is `true`
3. Check console for detection logs

### Toggle Button Not Visible
- In portrait mode, button only shows when not all photos are captured
- In landscape mode, button is always visible in right panel

### Performance Issues
- Increase detection interval (e.g., from 500ms to 1000ms)
- Disable detection when not needed

## 📚 Documentation

- **Quick Start**: This file
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Integration Guide**: `OBJECT_DETECTION_INTEGRATION.md`
- **Architecture Diagram**: See Mermaid diagram in conversation

## 💡 Tips

1. **Test on Device**: Detection works best on physical devices
2. **Good Lighting**: Better lighting = better detection (when using real ML)
3. **Toggle Off**: Disable detection to save battery when not needed
4. **Landscape Mode**: Easier to see bounding box in landscape orientation

## 🎯 Next Steps

1. ✅ Test the mock detection
2. ⏳ Install TensorFlow dependencies
3. ⏳ Download and integrate SSD MobileNet model
4. ⏳ Replace mock detection with real ML inference
5. ⏳ Test and optimize on physical devices

## 📞 Need Help?

- Check `OBJECT_DETECTION_INTEGRATION.md` for detailed setup
- Review `IMPLEMENTATION_SUMMARY.md` for architecture details
- Check inline code comments for specific functionality

---

**Status**: ✅ UI Complete | ⏳ ML Integration Pending

The foundation is ready - just add the TensorFlow model to enable real car detection!

