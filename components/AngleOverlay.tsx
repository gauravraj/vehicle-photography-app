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
};

export default function AngleOverlay({ angle, isLandscape = false }: Props) {
    return (
        <View style={styles.container} pointerEvents="none">
            <Image
                source={angle.overlayAsset}
                style={[
                    styles.overlay,
                    isLandscape && styles.overlayLandscape
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
    overlayLandscape: {
        transform: [{ rotate: '90deg' }],
    },
});
