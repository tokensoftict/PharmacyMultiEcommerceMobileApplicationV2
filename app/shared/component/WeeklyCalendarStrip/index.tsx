import React, { useMemo, useRef, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import dayjs from 'dayjs';
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

interface WeeklyCalendarStripProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({ selectedDate, onDateChange }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentMonth, setCurrentMonth] = React.useState(dayjs(selectedDate).format('MMMM YYYY'));

    // Generate dates for current week plus/minus 2 weeks for a decent scroll range
    const dates = useMemo(() => {
        const start = dayjs().subtract(28, 'day');
        return Array.from({ length: 60 }).map((_, i) => start.add(i, 'day'));
    }, []);

    const renderItem = ({ item }: { item: dayjs.Dayjs }) => {
        const dateString = item.format('YYYY-MM-DD');
        const isSelected = dateString === selectedDate;
        const isToday = dateString === dayjs().format('YYYY-MM-DD');
        const dayInitial = item.format('ddd').charAt(0);
        const dayNumber = item.format('D');

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onDateChange(dateString)}
                style={[
                    styles.dateItem,
                    isSelected && styles.selectedDateItem
                ]}
            >
                <Typography style={[
                    styles.dayInitial,
                    isSelected && styles.selectedText,
                    !isSelected && isToday && styles.todayText
                ]}>
                    {dayInitial}
                </Typography>
                <View style={[
                    styles.dateNumberCircle,
                    isSelected && styles.selectedDateNumberCircle
                ]}>
                    <Typography style={[
                        styles.dateNumber,
                        isSelected && styles.selectedText,
                        !isSelected && isToday && styles.todayText
                    ]}>
                        {dayNumber}
                    </Typography>
                </View>
                {isToday && !isSelected && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
        );
    };

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const firstVisibleDate = viewableItems[Math.floor(viewableItems.length / 2)].item;
            setCurrentMonth(firstVisibleDate.format('MMMM YYYY'));
        }
    }).current;

    // Auto-scroll to selected date on mount
    useEffect(() => {
        const selectedIndex = dates.findIndex(d => d.format('YYYY-MM-DD') === selectedDate);
        if (selectedIndex !== -1 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: selectedIndex,
                    animated: true,
                    viewPosition: 0.5
                });
            }, 300);
        }
    }, [selectedDate]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.monthText}>{currentMonth}</Typography>
            </View>
            <FlatList
                ref={flatListRef}
                data={dates}
                renderItem={renderItem}
                keyExtractor={(item) => item.format('YYYY-MM-DD')}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScrollToIndexFailed={() => {}}
                getItemLayout={(_, index) => ({
                    length: normalize(60),
                    offset: normalize(60) * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16),
        paddingVertical: normalize(12),
        marginHorizontal: normalize(12), // Reduced from 20 for more width
        marginBottom: normalize(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        paddingHorizontal: normalize(16),
        marginBottom: normalize(10),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F1F5F9',
        paddingBottom: normalize(8),
    },
    monthText: {
        fontSize: normalize(15),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: palette.main.p500,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        paddingHorizontal: normalize(10),
    },
    dateItem: {
        width: normalize(55),
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(4),
        borderRadius: normalize(12),
        marginHorizontal: normalize(2),
    },
    selectedDateItem: {
        backgroundColor: `${palette.main.p500}10`,
    },
    dayInitial: {
        fontSize: normalize(12),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#64748B',
        marginBottom: normalize(6),
        textTransform: 'uppercase',
    },
    dateNumberCircle: {
        width: normalize(32),
        height: normalize(32),
        borderRadius: normalize(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDateNumberCircle: {
        backgroundColor: palette.main.p500,
    },
    dateNumber: {
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#1E293B',
    },
    selectedText: {
        color: '#FFFFFF',
    },
    todayText: {
        color: palette.main.p500,
    },
    todayIndicator: {
        width: normalize(4),
        height: normalize(4),
        borderRadius: normalize(2),
        backgroundColor: palette.main.p500,
        marginTop: normalize(4),
    }
});

export default WeeklyCalendarStrip;
