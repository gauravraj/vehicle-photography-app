import { CarAngle } from '@/constants/carAngles';
import React from 'react';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

type Props = {
    angle: CarAngle;
    isLandscape?: boolean;
    deviceRotation?: number;
};

export default function AngleOverlay({ angle, isLandscape = false, deviceRotation = 0 }: Props) {
    // The overlay should stay aligned with the camera view
    // When in landscape, we rotate 90° to match the screen orientation
    // The deviceRotation compensates for device tilt to keep the overlay upright
    const baseRotation = isLandscape ? 90 : 0;
    const totalRotation = baseRotation + deviceRotation;

    // Debug logging
    console.log('AngleOverlay - isLandscape:', isLandscape, 'deviceRotation:', deviceRotation, 'totalRotation:', totalRotation);

    return (
        <View style={styles.container} pointerEvents="none">
            <Image
                source={angle.overlayAsset}
                style={[
                    styles.overlay,
                    { transform: [{ rotate: `${totalRotation}deg` }] }
                ]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    overlay: {
        width: '95%',
        height: '100%',
        // tintColor works correctly on transparent-background PNGs:
        // it recolors only non-transparent pixels → pure white outlines
        tintColor: '#FFFFFF',
        opacity: 0.6,
    },
});
