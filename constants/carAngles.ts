export type CarAngle = {
    id: number;
    label: string;
    shortLabel: string;
    iconName: string; // MaterialCommunityIcons name
    overlayAsset: any; // require(...)
};

export const CAR_ANGLES: CarAngle[] = [
    {
        id: 1,
        label: 'Front',
        shortLabel: 'Front',
        iconName: 'car',
        overlayAsset: require('../assets/overlays/front_outline.png'),
    },
    {
        id: 2,
        label: 'Front Left',
        shortLabel: 'Fr. Left',
        iconName: 'car-arrow-left',
        overlayAsset: require('../assets/overlays/front-left_outline.png'),
    },
    {
        id: 3,
        label: 'Driver Side',
        shortLabel: 'Driver',
        iconName: 'car-side',
        overlayAsset: require('../assets/overlays/driver-side_outline.png'),
    },
    {
        id: 4,
        label: 'Rear Left',
        shortLabel: 'Re. Left',
        iconName: 'car-arrow-left',
        overlayAsset: require('../assets/overlays/rear-left_outline.png'),
    },
    {
        id: 5,
        label: 'Rear',
        shortLabel: 'Rear',
        iconName: 'car-back',
        overlayAsset: require('../assets/overlays/rear_outline.png'),
    },
    {
        id: 6,
        label: 'Rear Right',
        shortLabel: 'Re. Right',
        iconName: 'car-arrow-right',
        overlayAsset: require('../assets/overlays/rear-right_outline.png'),
    },
    {
        id: 7,
        label: 'Passenger Side',
        shortLabel: 'Pass.',
        iconName: 'car-side',
        overlayAsset: require('../assets/overlays/passenger-side_outline.png'),
    },
    {
        id: 8,
        label: 'Front Right',
        shortLabel: 'Fr. Right',
        iconName: 'car-arrow-right',
        overlayAsset: require('../assets/overlays/front-right_outline.png'),
    },
    {
        id: 9,
        label: 'Interior Front',
        shortLabel: 'Int. Front',
        iconName: 'steering',
        overlayAsset: require('../assets/overlays/interior-front_outline.png'),
    },
    {
        id: 10,
        label: 'Interior Rear',
        shortLabel: 'Int. Rear',
        iconName: 'car-seat',
        overlayAsset: require('../assets/overlays/interior-rear_outline.png'),
    },
    {
        id: 11,
        label: 'Odometer',
        shortLabel: 'Odometer',
        iconName: 'speedometer',
        overlayAsset: require('../assets/overlays/odometer_outline.png'),
    },
];
