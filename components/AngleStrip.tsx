import { CAR_ANGLES, CarAngle } from '@/constants/carAngles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    selectedAngleId: number;
    capturedImages: Record<number, string | null>;
    onSelectAngle: (angle: CarAngle) => void;
    orientation: 'portrait' | 'landscape';
};

export default function AngleStrip({
    selectedAngleId,
    capturedImages,
    onSelectAngle,
    orientation,
}: Props) {
    const scrollRef = useRef<ScrollView>(null);

    // Auto-scroll to keep selected angle visible
    useEffect(() => {
        const index = CAR_ANGLES.findIndex((a) => a.id === selectedAngleId);
        if (scrollRef.current && index >= 0) {
            const ITEM_SIZE = orientation === 'portrait' ? 70 : 78;
            scrollRef.current.scrollTo({
                x: orientation === 'portrait' ? index * ITEM_SIZE : 0,
                y: orientation === 'landscape' ? index * ITEM_SIZE : 0,
                animated: true,
            });
        }
    }, [selectedAngleId, orientation]);

    const isPortrait = orientation === 'portrait';

    return (
        <View style={[styles.container, isPortrait ? styles.containerH : styles.containerV]}>
            <ScrollView
                ref={scrollRef}
                horizontal={isPortrait}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={isPortrait ? styles.scrollContentH : styles.scrollContentV}
            >
                {CAR_ANGLES.map((angle, index) => {
                    const isSelected = angle.id === selectedAngleId;
                    const capturedUri = capturedImages[angle.id];
                    const isCaptured = !!capturedUri;

                    return (
                        <TouchableOpacity
                            key={angle.id}
                            style={[
                                styles.item,
                                isPortrait ? styles.itemH : styles.itemV,
                                isSelected && styles.itemSelected,
                                isCaptured && styles.itemCaptured,
                            ]}
                            onPress={() => onSelectAngle(angle)}
                            activeOpacity={0.75}
                        >
                            {/* Thumbnail or icon */}
                            <View style={styles.iconContainer}>
                                {capturedUri ? (
                                    <Image source={{ uri: capturedUri }} style={styles.thumbnail} />
                                ) : (
                                    <MaterialCommunityIcons
                                        name={angle.iconName as any}
                                        size={22}
                                        color={isSelected ? '#60A5FA' : '#94A3B8'}
                                    />
                                )}
                                {/* Green check badge */}
                                {isCaptured && (
                                    <View style={styles.checkBadge}>
                                        <MaterialCommunityIcons name="check-circle" size={14} color="#22C55E" />
                                    </View>
                                )}
                            </View>

                            {/* Angle number badge */}
                            <View style={[styles.numberBadge, isSelected && styles.numberBadgeSelected]}>
                                <Text style={[styles.numberText, isSelected && styles.numberTextSelected]}>
                                    {index + 1}
                                </Text>
                            </View>

                            <Text
                                style={[styles.label, isSelected && styles.labelSelected]}
                                numberOfLines={1}
                            >
                                {angle.shortLabel}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
    },
    containerH: {
        height: 88,
    },
    containerV: {
        width: 78,
    },
    scrollContentH: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    scrollContentV: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'transparent',
        gap: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    itemH: {
        width: 62,
        height: 70,
        marginHorizontal: 3,
    },
    itemV: {
        width: 62,
        height: 70,
        marginVertical: 3,
    },
    itemSelected: {
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
    },
    itemCaptured: {
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
    },
    iconContainer: {
        position: 'relative',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 30,
        height: 30,
        borderRadius: 4,
    },
    checkBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#0A0E1A',
        borderRadius: 8,
    },
    numberBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberBadgeSelected: {
        backgroundColor: '#60A5FA',
    },
    numberText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#94A3B8',
    },
    numberTextSelected: {
        color: '#fff',
    },
    label: {
        fontSize: 9,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
    labelSelected: {
        color: '#60A5FA',
        fontWeight: '700',
    },
});
