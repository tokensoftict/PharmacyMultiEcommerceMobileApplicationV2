import { Dimensions, StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import { labels, palette } from "@/shared/constants/colors";

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 45) / 2;

export const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        flexDirection: "row",
        backgroundColor: '#F7D9D9',
        paddingTop: normalize(80),
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
        borderBottomLeftRadius: normalize(30),
        borderBottomRightRadius: normalize(30),
    },
    avatar: {
        width: normalize(80),
        height: normalize(80),
        marginRight: normalize(12),
    },
    avatarCustomer: {
        width: normalize(40),
        height: normalize(40),
        marginRight: normalize(12),
    },
    headerText: {
        color: labels.type4.textColor,
        fontSize: normalize(20),

    },
    subHeaderText: {
        fontSize: normalize(12),
    },
    code: {
        fontSize: normalize(12),

        borderBottomWidth: normalize(1),
        borderColor: '#d32f2f'
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: normalize(10),
    },
    card: {
        backgroundColor: '#d32f2f',
        flex: 1,
        marginHorizontal: normalize(5),
        padding: normalize(15),
        borderRadius: normalize(12),
    },
    cardFull: {
        backgroundColor: '#c62828',
        flex: 1,
        marginHorizontal: normalize(10),
        padding: normalize(20),
        borderRadius: normalize(12),
    },
    cardContent: {
        alignItems: 'center'
    },
    cardTitle: {
        color: '#fff',
        fontSize: normalize(16),
        marginTop: normalize(5),

    },
    cardValue: {
        color: '#fff',
        fontSize: normalize(22),

        marginTop: normalize(5)
    },
    tabContainer: {
        flex: 1,
        padding: normalize(10),
        backgroundColor: '#fff'
    },
    searchInput: {
        height: normalize(40),
        borderColor: '#ccc',
        borderWidth: normalize(1),
        paddingHorizontal: normalize(10),
        borderRadius: normalize(8),
        marginBottom: normalize(10),
    },
    gridItem: {
        marginBottom: normalize(10),
    },
    gridCard: {
        backgroundColor: '#fff3f3',
        borderRadius: normalize(10),
        padding: normalize(10),
        borderColor: '#ffcdd2',
        borderWidth: normalize(1),
    },
    header: {

    },
    gridContent: {
        justifyContent: 'center',
    },
    gridTitle: {
        fontSize: normalize(14),

        color: '#b00020',
        marginBottom: normalize(5),
    },
    gridSub: {
        fontSize: normalize(12),
        color: '#555',
    },
    status: {
        fontSize: normalize(12),
        color: labels.type4.textColor,
    },
});
