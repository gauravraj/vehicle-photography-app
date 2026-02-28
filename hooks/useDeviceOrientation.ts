import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from 'react';

export type DeviceOrientation = 'portrait' | 'landscape-left' | 'landscape-right' | 'portrait-upside-down';

/**
 * Custom hook to detect device orientation using accelerometer data
 * Returns the current device orientation and rotation angle in degrees
 */
export function useDeviceOrientation() {
    const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
    const [rotationDegrees, setRotationDegrees] = useState(0);

    useEffect(() => {
        // Set update interval to 100ms for smooth rotation
        DeviceMotion.setUpdateInterval(100);

        const subscription = DeviceMotion.addListener((data) => {
            const { rotation } = data;
            
            if (!rotation) return;

            // rotation.gamma: left/right tilt (-90 to 90)
            // rotation.beta: front/back tilt (-180 to 180)
            const { beta, gamma } = rotation;

            // Determine orientation based on device tilt
            let newOrientation: DeviceOrientation = 'portrait';
            let degrees = 0;

            // Calculate orientation based on gamma (left/right tilt)
            if (Math.abs(gamma) > Math.abs(beta)) {
                // Device is in landscape
                if (gamma > 0) {
                    newOrientation = 'landscape-right';
                    degrees = -90; // Rotate icons 90deg counter-clockwise to stay upright
                } else {
                    newOrientation = 'landscape-left';
                    degrees = 90; // Rotate icons 90deg clockwise to stay upright
                }
            } else {
                // Device is in portrait
                if (beta < 0) {
                    newOrientation = 'portrait-upside-down';
                    degrees = 180; // Rotate icons 180deg to stay upright
                } else {
                    newOrientation = 'portrait';
                    degrees = 0; // No rotation needed
                }
            }

            setOrientation(newOrientation);
            setRotationDegrees(degrees);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return { orientation, rotationDegrees };
}

