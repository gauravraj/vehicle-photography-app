import { CarAngle } from '@/constants/carAngles';
import React from 'react';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

type Props = {
    angle: CarAngle;
};

export default function AngleOverlay({ angle }: Props) {
    return (
        <View style={styles.container} pointerEvents="none">
            <Image
                source={angle.overlayAsset}
                style={styles.overlay}
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
        width: '85%',
        height: '70%',
        // tintColor works correctly on transparent-background PNGs:
        // it recolors only non-transparent pixels → pure white outlines
        tintColor: '#FFFFFF',
        opacity: 0.6,
    },
});
