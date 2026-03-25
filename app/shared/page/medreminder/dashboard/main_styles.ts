import { Dimensions, Platform, StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F5F9", // Modern light background
    },
    // Modern Header
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? normalize(55) : normalize(15),
        paddingHorizontal: normalize(20),
        backgroundColor: "#F44336", // Consistent Red theme
        borderBottomLeftRadius: normalize(32),
        borderBottomRightRadius: normalize(32),
        paddingBottom: normalize(40),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    headerGreeting: {
        fontSize: normalize(24),
        color: 'white',
    },
    headerSubtitle: {
        fontSize: normalize(14),
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: normalize(4),
    },
    notificationButton: {
        width: normalize(44),
        height: normalize(44),
        borderRadius: normalize(12),
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    // Featured Progress Card
    featuredCardContainer: {
        marginTop: normalize(-30),
        paddingHorizontal: normalize(20),
        marginBottom: normalize(25),
    },
    featuredCard: {
        backgroundColor: 'white',
        borderRadius: normalize(24),
        padding: normalize(20),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: normalize(10) },
        shadowOpacity: 0.1,
        shadowRadius: normalize(20),
        elevation: 8,
    },
    featuredInfo: {
        flex: 1,
    },
    featuredTitle: {
        fontSize: normalize(18),
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
        color: '#1E293B',
    },
    featuredSubtitle: {
        fontSize: normalize(14),
        color: '#64748B',
        marginTop: normalize(4),
    },
    progressRingContainer: {
        width: normalize(90),
        height: normalize(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        position: 'absolute',
        fontSize: normalize(18),
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
        color: '#F44336',
    },
    // Content Area
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: normalize(20),
        marginBottom: normalize(25),
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: normalize(15),
    },
    sectionTitle: {
        fontSize: normalize(18),

        color: "#1E293B",
    },
    seeAllButton: {
        fontSize: normalize(14),
        color: "#F44336",
    },
    // Quick Actions Grid
    quickActionsGrid: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: normalize(5),
    },
    actionButton: {
        width: (width - normalize(60)) / 4,
        alignItems: 'center',
    },
    actionIconWrapper: {
        width: normalize(56),
        height: normalize(56),
        borderRadius: normalize(28),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(8),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: normalize(4) },
        shadowOpacity: 0.1,
        shadowRadius: normalize(6),
        elevation: 4,
    },
    actionLabel: {
        fontSize: normalize(12),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        color: '#475569',
        textAlign: 'center',
    },
    // Schedule Cards
    doseCard: {
        backgroundColor: 'white',
        borderRadius: normalize(20),
        padding: normalize(16),
        marginBottom: normalize(16),
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: normalize(4) },
        shadowOpacity: 0.05,
        shadowRadius: normalize(10),
        elevation: 3,
    },
    doseIconContainer: {
        width: normalize(52),
        height: normalize(52),
        borderRadius: normalize(16),
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(16),
    },
    doseInfo: {
        flex: 1,
    },
    medicineName: {
        fontSize: normalize(16),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: "#1E293B",
        marginBottom: normalize(2),
    },
    dosageInfo: {
        fontSize: normalize(14),
        color: "#64748B",
    },
    doseTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(8),
    },
    timeText: {
        fontSize: normalize(12),
        color: "#94A3B8",
        marginLeft: normalize(4),
        fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    },
    takeDoseButton: {
        backgroundColor: "#F44336",
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(8),
        borderRadius: normalize(12),
    },
    takeDoseText: {
        color: "white",
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    },
    takenBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0FDF4",
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(6),
        borderRadius: normalize(10),
    },
    takenText: {
        color: "#16A34A",
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        marginLeft: normalize(4),
    },
    // Empty State
    emptyState: {
        alignItems: "center",
        justifyContent: 'center',
        padding: normalize(40),
        backgroundColor: 'white',
        borderRadius: normalize(24),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: normalize(4) },
        shadowOpacity: 0.05,
        shadowRadius: normalize(15),
        elevation: 2,
    },
    emptyStateText: {
        fontSize: normalize(16),
        color: "#64748B",
        textAlign: 'center',
        marginTop: normalize(16),
        marginBottom: normalize(24),
    },
    addMedicationButton: {
        backgroundColor: "#F44336",
        paddingHorizontal: normalize(24),
        paddingVertical: normalize(12),
        borderRadius: normalize(12),
    },
    addMedicationButtonText: {
        color: "white",
        fontSize: normalize(15),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    },
});

export default styles;
