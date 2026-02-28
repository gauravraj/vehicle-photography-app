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
        let subscription: any;

        const setupSensor = async () => {
            try {
                // Check if DeviceMotion is available
                const isAvailable = await DeviceMotion.isAvailableAsync();
                //console.log('DeviceMotion available:', isAvailable);

                if (!isAvailable) {
                    console.warn('DeviceMotion is not available on this device');
                    return;
                }

                // Request permissions (required on iOS 13+)
                // Check if requestPermissionsAsync exists before calling it
                if (typeof DeviceMotion.requestPermissionsAsync === 'function') {
                    const { status } = await DeviceMotion.requestPermissionsAsync();
                    console.log('DeviceMotion permission status:', status);

                    if (status !== 'granted') {
                        console.warn('DeviceMotion permission not granted');
                        return;
                    }
                } else {
                    console.log('DeviceMotion.requestPermissionsAsync not available, proceeding without explicit permission request');
                }

                // Set update interval to 100ms for smooth rotation
                DeviceMotion.setUpdateInterval(100);

                subscription = DeviceMotion.addListener((data) => {
                    const { rotation } = data;

                    //console.log('DeviceMotion data:', data);

                    if (!rotation) {
                        console.log('No rotation data available');
                        return;
                    }

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

                    //console.log('Orientation:', newOrientation, 'Degrees:', degrees);
                    setOrientation(newOrientation);
                    setRotationDegrees(degrees);
                });
            } catch (error) {
                console.error('Error setting up DeviceMotion:', error);
            }
        };

        setupSensor();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return { orientation, rotationDegrees };
}

