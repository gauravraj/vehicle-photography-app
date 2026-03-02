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
    screenWidth: number;
    screenHeight: number;
};

function AngleOverlay({ angle, isLandscape = false, deviceRotation = 0, screenWidth, screenHeight }: Props) {
    // The overlay should stay aligned with the camera view
    // When in landscape, we rotate 90° to match the screen orientation
    // The deviceRotation compensates for device tilt to keep the overlay upright
    const baseRotation = isLandscape ? 90 : 0;
    const totalRotation = baseRotation + deviceRotation;

    // Determine if device is physically rotated to landscape based on rotation angle
    // When totalRotation is around 90 or -90, device is in landscape
    const isPhysicallyLandscape = Math.abs(totalRotation % 180) > 45 && Math.abs(totalRotation % 180) < 135;

    // Calculate overlay dimensions based on physical device orientation
    // When device is rotated to landscape, swap width/height to maintain proper scaling
    const overlayWidth = isPhysicallyLandscape ? screenHeight * angle.landscapeScaleFactor : screenWidth * angle.portraitScaleFactor;
    const overlayHeight = isPhysicallyLandscape ? screenWidth * angle.landscapeScaleFactor : screenHeight * angle.portraitScaleFactor;

    return (
        <View style={styles.container} pointerEvents="none">
            <Image
                source={angle.overlayAsset}
                style={{
                    width: overlayWidth,
                    height: overlayHeight,
                    opacity: 0.6,
                    transform: [{ rotate: `${totalRotation}deg` }]
                }}
                resizeMode="contain"
                fadeDuration={0}
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
});

export default React.memo(AngleOverlay);
