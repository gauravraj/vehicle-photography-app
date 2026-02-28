import AngleOverlay from '@/components/AngleOverlay';
import AngleStrip from '@/components/AngleStrip';
import { CAR_ANGLES, CarAngle } from '@/constants/carAngles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    capturedImages: Record<number, string | null>;
    onCapture: (angleId: number, uri: string) => void;
    onClose: () => void;
};

export default function CameraCapture({ capturedImages, onCapture, onClose }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isLandscape = width > height;

    // Find first uncaptured angle as default
    const firstUncaptured = CAR_ANGLES.find((a) => !capturedImages[a.id]) ?? CAR_ANGLES[0];
    const [selectedAngle, setSelectedAngle] = useState<CarAngle>(firstUncaptured);
    const [isCapturing, setIsCapturing] = useState(false);

    // Flash animation for shutter feedback
    const flashAnim = useRef(new Animated.Value(0)).current;
    const shutterScaleAnim = useRef(new Animated.Value(1)).current;

    const handleSelectAngle = useCallback((angle: CarAngle) => {
        setSelectedAngle(angle);
    }, []);

    const triggerShutterAnimation = () => {
        // Flash white overlay
        Animated.sequence([
            Animated.timing(flashAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
        // Shutter button press scale
        Animated.sequence([
            Animated.timing(shutterScaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
            Animated.timing(shutterScaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
    };

    const handleCapture = async () => {
        if (!cameraRef.current || isCapturing) return;
        setIsCapturing(true);
        triggerShutterAnimation();

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.85,
                skipProcessing: false,
            });

            if (photo?.uri) {
                onCapture(selectedAngle.id, photo.uri);

                // Auto-advance to next uncaptured angle
                const currentIndex = CAR_ANGLES.findIndex((a) => a.id === selectedAngle.id);
                const nextAngle = CAR_ANGLES.slice(currentIndex + 1).find(
                    (a) => !capturedImages[a.id] && a.id !== selectedAngle.id
                );
                // Also check from beginning if no uncaptured after current
                const nextFromStart = CAR_ANGLES.find(
                    (a) => !capturedImages[a.id] && a.id !== selectedAngle.id
                );

                const next = nextAngle ?? nextFromStart;
                if (next) {
                    setSelectedAngle(next);
                }
            }
        } catch (e) {
            Alert.alert('Capture failed', 'Unable to take photo. Please try again.');
        } finally {
            setIsCapturing(false);
        }
    };

    // Request permission on mount
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    if (!permission) {
        return (
            <View style={[styles.root, styles.centerContent]}>
                <Text style={styles.permText}>Requesting camera permission…</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={[styles.root, styles.centerContent]}>
                <MaterialCommunityIcons name="camera-off" size={52} color="#64748B" />
                <Text style={styles.permTitle}>Camera Access Required</Text>
                <Text style={styles.permText}>
                    Car Inspector needs camera access to capture vehicle images.
                </Text>
                <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
                    <Text style={styles.permButtonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeTextBtn} onPress={onClose}>
                    <Text style={styles.closeTextBtnLabel}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const capturedCount = Object.values(capturedImages).filter(Boolean).length;
    const allCaptured = capturedCount === 11;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {isLandscape ? (
                /* ── LANDSCAPE layout ── */
                <View style={styles.landscape}>
                    {/* Left: angle strip */}
                    <View style={[styles.leftStrip, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                        <AngleStrip
                            selectedAngleId={selectedAngle.id}
                            capturedImages={capturedImages}
                            onSelectAngle={handleSelectAngle}
                            orientation="landscape"
                        />
                    </View>

                    {/* Center: camera */}
                    <View style={styles.cameraWrapper}>
                        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
                        <AngleOverlay angle={selectedAngle} />

                        {/* Angle label */}
                        <View style={[styles.angleLabelBar, { bottom: 20 + insets.bottom }]}>
                            <Text style={styles.angleLabelText}>{selectedAngle.label}</Text>
                            <Text style={styles.angleProgressText}>{capturedCount}/11 captured</Text>
                        </View>

                        {/* Flash overlay */}
                        <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} pointerEvents="none" />
                    </View>

                    {/* Right: controls */}
                    <View style={[styles.rightControls, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingRight: insets.right }]}>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={22} color="#F1F5F9" />
                        </TouchableOpacity>

                        <Animated.View style={{ transform: [{ scale: shutterScaleAnim }] }}>
                            <TouchableOpacity
                                style={[styles.shutterBtn, (isCapturing || allCaptured) && styles.shutterBtnDisabled]}
                                onPress={handleCapture}
                                disabled={isCapturing || allCaptured}
                                activeOpacity={0.85}
                            >
                                <View style={styles.shutterInner} />
                            </TouchableOpacity>
                        </Animated.View>

                        {allCaptured && (
                            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                                <Text style={styles.doneBtnText}>Done</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                /* ── PORTRAIT layout ── */
                <View style={styles.portrait}>
                    {/* Top: angle strip */}
                    <View style={[styles.topStrip, { paddingTop: insets.top }]}>
                        <AngleStrip
                            selectedAngleId={selectedAngle.id}
                            capturedImages={capturedImages}
                            onSelectAngle={handleSelectAngle}
                            orientation="portrait"
                        />
                    </View>

                    {/* Camera view */}
                    <View style={styles.cameraWrapper}>
                        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
                        <AngleOverlay angle={selectedAngle} />

                        {/* Angle label */}
                        <View style={styles.angleLabelBar}>
                            <Text style={styles.angleLabelText}>{selectedAngle.label}</Text>
                            <Text style={styles.angleProgressText}>{capturedCount}/11 captured</Text>
                        </View>

                        {/* Flash overlay */}
                        <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} pointerEvents="none" />
                    </View>

                    {/* Bottom bar: close + shutter + placeholder */}
                    <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={22} color="#F1F5F9" />
                        </TouchableOpacity>

                        <Animated.View style={{ transform: [{ scale: shutterScaleAnim }] }}>
                            <TouchableOpacity
                                style={[styles.shutterBtn, (isCapturing || allCaptured) && styles.shutterBtnDisabled]}
                                onPress={handleCapture}
                                disabled={isCapturing || allCaptured}
                                activeOpacity={0.85}
                            >
                                <View style={styles.shutterInner} />
                            </TouchableOpacity>
                        </Animated.View>

                        {allCaptured ? (
                            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                                <MaterialCommunityIcons name="check" size={18} color="#fff" />
                                <Text style={styles.doneBtnText}>Done</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.closePlaceholder} />
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: 32,
    },
    // ------ Portrait ------
    portrait: {
        flex: 1,
        flexDirection: 'column',
    },
    topStrip: {
        backgroundColor: 'rgba(10, 14, 26, 0.95)',
        zIndex: 10,
    },
    cameraWrapper: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    bottomBar: {
        backgroundColor: 'rgba(10, 14, 26, 0.95)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 14,
        paddingHorizontal: 32,
    },
    // ------ Landscape ------
    landscape: {
        flex: 1,
        flexDirection: 'row',
    },
    leftStrip: {
        backgroundColor: 'rgba(10, 14, 26, 0.95)',
        zIndex: 10,
    },
    rightControls: {
        backgroundColor: 'rgba(10, 14, 26, 0.95)',
        width: 90,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 8,
    },
    // ------ Shared camera UI ------
    angleLabelBar: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 2,
    },
    angleLabelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    angleProgressText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    // ------ Controls ------
    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closePlaceholder: {
        width: 42,
        height: 42,
    },
    shutterBtn: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 3,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    shutterBtnDisabled: {
        opacity: 0.4,
    },
    shutterInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#fff',
    },
    doneBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#22C55E',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    doneBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    // ------ Permission screen ------
    permTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F1F5F9',
        textAlign: 'center',
    },
    permText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    permButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        marginTop: 8,
    },
    permButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    closeTextBtn: {
        marginTop: 4,
    },
    closeTextBtnLabel: {
        fontSize: 14,
        color: '#64748B',
    },
});
