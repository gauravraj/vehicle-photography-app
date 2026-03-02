import { CarAngle } from '@/constants/carAngles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    visible: boolean;
    angle: CarAngle | null;
    capturedImageUri: string | null;
    onClose: () => void;
};

export default function ImageViewer({ visible, angle, capturedImageUri, onClose }: Props) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    if (!angle) return null;

    console.log('[ImageViewer] Rendering:', {
        visible,
        angleLabel: angle.label,
        hasCapturedUri: !!capturedImageUri,
        capturedImageUri,
        hasOverlayAsset: !!angle.overlayAsset,
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.container}>
                {/* Background overlay */}
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Image content */}
                <View style={styles.imageContainer}>
                    {capturedImageUri ? (
                        <Image
                            source={{ uri: capturedImageUri }}
                            style={{
                                width: width - 40,
                                height: height - 100,
                            }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.overlayImageWrapper}>
                            <Image
                                source={angle.overlayAsset}
                                style={{
                                    width: width * 0.7,
                                    height: height * 0.7,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>

                {/* Close button */}
                <TouchableOpacity
                    style={[
                        styles.closeButton,
                        {
                            top: insets.top + 16,
                            right: 16,
                        },
                    ]}
                    onPress={onClose}
                >
                    <MaterialCommunityIcons name="close" size={24} color="#F1F5F9" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    overlayImageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 20,
    },
    image: {
        // Dimensions are set inline based on screen size
    },
    closeButton: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
});

