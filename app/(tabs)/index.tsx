import CameraCapture from '@/components/CameraCapture';
import GalleryGrid from '@/components/GalleryGrid';
import { CAR_ANGLES } from '@/constants/carAngles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Initialise all 11 slots as null (not yet captured)
function initCapturedImages(): Record<number, string | null> {
  const map: Record<number, string | null> = {};
  CAR_ANGLES.forEach((a) => (map[a.id] = null));
  return map;
}

export default function HomeScreen() {
  const [capturedImages, setCapturedImages] = useState<Record<number, string | null>>(
    initCapturedImages
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapture = useCallback((angleId: number, uri: string) => {
    setCapturedImages((prev) => ({ ...prev, [angleId]: uri }));
  }, []);

  const handleOpen = () => setIsCameraOpen(true);
  const handleClose = () => setIsCameraOpen(false);

  const handleReset = () => {
    setCapturedImages(initCapturedImages());
  };

  const capturedCount = Object.values(capturedImages).filter(Boolean).length;
  const progress = capturedCount / 11;
  const allDone = capturedCount === 11;

  // Full-screen camera overlay
  if (isCameraOpen) {
    return (
      <CameraCapture
        capturedImages={capturedImages}
        onCapture={handleCapture}
        onClose={handleClose}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <MaterialCommunityIcons name="car-search" size={22} color="#60A5FA" />
            </View>
            <View>
              <Text style={styles.appTitle}>Car Inspector</Text>
              <Text style={styles.appSubtitle}>Multi-angle capture</Text>
            </View>
          </View>
          {capturedCount > 0 && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <MaterialCommunityIcons name="refresh" size={16} color="#94A3B8" />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {capturedCount}/11 angles
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Start capture card */}
        <View style={styles.captureCard}>
          {allDone ? (
            <>
              <View style={styles.doneIconCircle}>
                <MaterialCommunityIcons name="check-circle" size={40} color="#22C55E" />
              </View>
              <Text style={styles.captureCardTitle}>All Angles Captured!</Text>
              <Text style={styles.captureCardSubtitle}>
                All 11 inspection photos have been saved.
              </Text>
              <TouchableOpacity style={[styles.captureButton, styles.captureButtonDone]} onPress={handleOpen}>
                <MaterialCommunityIcons name="camera-retake" size={20} color="#fff" />
                <Text style={styles.captureButtonText}>Retake Photos</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.captureIconRow}>
                <MaterialCommunityIcons name="camera-plus" size={32} color="#60A5FA" />
              </View>
              <Text style={styles.captureCardTitle}>
                {capturedCount === 0 ? 'Start Inspection' : 'Continue Capture'}
              </Text>
              <Text style={styles.captureCardSubtitle}>
                {capturedCount === 0
                  ? 'Capture all 11 required angles for a full vehicle inspection.'
                  : `${11 - capturedCount} angle${11 - capturedCount !== 1 ? 's' : ''} remaining.`}
              </Text>
              <TouchableOpacity style={styles.captureButton} onPress={handleOpen} activeOpacity={0.88}>
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                <Text style={styles.captureButtonText}>
                  {capturedCount === 0 ? 'Start Capture' : 'Continue Capture'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Captured Angles</Text>
          {capturedCount > 0 && (
            <View style={styles.capturedBadge}>
              <Text style={styles.capturedBadgeText}>{capturedCount} done</Text>
            </View>
          )}
        </View>

        {/* Gallery grid */}
        <GalleryGrid
          capturedImages={capturedImages}
          onStartCapture={handleOpen}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#080C18',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#0D1221',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(96,165,250,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    marginTop: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  resetBtnText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  progressLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    minWidth: 55,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 0,
  },
  // Capture card
  captureCard: {
    backgroundColor: '#0D1221',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.15)',
  },
  captureIconRow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96,165,250,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(34,197,94,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    marginTop: 4,
  },
  captureCardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonDone: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
  },
  captureButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#CBD5E1',
    letterSpacing: -0.2,
  },
  capturedBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capturedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22C55E',
  },
});
