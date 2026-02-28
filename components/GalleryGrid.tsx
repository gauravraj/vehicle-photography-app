import { CAR_ANGLES } from '@/constants/carAngles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

type Props = {
    capturedImages: Record<number, string | null>;
    onStartCapture: () => void;
};

const NUM_COLS = 4;

export default function GalleryGrid({ capturedImages, onStartCapture }: Props) {
    const capturedCount = Object.values(capturedImages).filter(Boolean).length;

    return (
        <View style={styles.container}>
            {/* Header stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{capturedCount}</Text>
                    <Text style={styles.statLabel}>Captured</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{11 - capturedCount}</Text>
                    <Text style={styles.statLabel}>Remaining</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>11</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {CAR_ANGLES.map((angle, index) => {
                    const uri = capturedImages[angle.id];
                    const isCaptured = !!uri;

                    return (
                        <View key={angle.id} style={styles.cell}>
                            <View
                                style={[
                                    styles.thumbnail,
                                    isCaptured ? styles.thumbnailCaptured : styles.thumbnailPending,
                                ]}
                            >
                                {isCaptured ? (
                                    <Image source={{ uri }} style={styles.capturedImg} resizeMode="cover" />
                                ) : (
                                    <View style={styles.placeholderContent}>
                                        <MaterialCommunityIcons
                                            name={angle.iconName as any}
                                            size={26}
                                            color="rgba(148,163,184,0.5)"
                                        />
                                    </View>
                                )}

                                {/* Index badge */}
                                <View style={[styles.indexBadge, isCaptured && styles.indexBadgeCaptured]}>
                                    <Text style={styles.indexText}>{index + 1}</Text>
                                </View>

                                {/* Green check for captured */}
                                {isCaptured && (
                                    <View style={styles.capturedBadge}>
                                        <MaterialCommunityIcons name="check-circle" size={16} color="#22C55E" />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.cellLabel} numberOfLines={1}>
                                {angle.shortLabel}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        gap: 0,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F1F5F9',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    cell: {
        width: `${100 / NUM_COLS - 2.5}%`,
        alignItems: 'center',
        gap: 5,
    },
    thumbnail: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'visible',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnailPending: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderStyle: 'dashed',
        borderRadius: 12,
        overflow: 'hidden',
    },
    thumbnailCaptured: {
        borderWidth: 1.5,
        borderColor: '#22C55E',
        borderRadius: 12,
        overflow: 'hidden',
    },
    capturedImg: {
        width: '100%',
        height: '100%',
    },
    placeholderContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    indexBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    indexBadgeCaptured: {
        backgroundColor: 'rgba(34,197,94,0.25)',
    },
    indexText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#CBD5E1',
    },
    capturedBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
    },
    cellLabel: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
});
