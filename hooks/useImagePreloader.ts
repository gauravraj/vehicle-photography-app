import { CAR_ANGLES } from '@/constants/carAngles';
import { useEffect, useState } from 'react';

/**
 * Hook to preload all car overlay images.
 * Simply waits a short time to ensure images are in cache.
 * The actual preloading happens via off-screen rendering in the component.
 */
export function useImagePreloader() {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        // Set a timeout to mark images as "loaded" after a brief delay
        // This gives time for the off-screen images to render
        const timer = setTimeout(() => {
            console.log('✅ Images marked as ready');
            setImagesLoaded(true);
        }, 100); // Very short delay, just to ensure first render completes

        return () => clearTimeout(timer);
    }, []);

    return { imagesLoaded, loadedCount: CAR_ANGLES.length, totalImages: CAR_ANGLES.length };
}

