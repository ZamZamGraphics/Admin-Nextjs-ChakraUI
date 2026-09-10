import { Document, Page, Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer';

// Optional: register custom fonts (needed if you want Bangla or custom typefaces)
Font.register({ family: 'Roboto', src: "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu72xKOzY.woff2" });

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontFamily: 'Roboto',
        position: 'relative',
    },
    border: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        border: '3pt solid #1a3c6e',
    },
    innerBorder: {
        position: 'absolute',
        top: 28,
        left: 28,
        right: 28,
        bottom: 28,
        border: '1pt solid #c9a94f',
    },
    content: {
        marginTop: 90,
        paddingHorizontal: 60,
        alignItems: 'center',
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        color: '#1a3c6e',
        letterSpacing: 4,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 12,
        color: '#555',
        marginBottom: 30,
    },
    presentedTo: {
        fontSize: 11,
        color: '#777',
        marginBottom: 6,
    },
    studentName: {
        fontSize: 26,
        fontWeight: 700,
        color: '#111',
        marginBottom: 14,
        borderBottom: '1pt solid #c9a94f',
        paddingBottom: 8,
        minWidth: 320,
        textAlign: 'center',
    },
    bodyText: {
        fontSize: 11,
        color: '#333',
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 420,
        marginBottom: 30,
    },
    courseName: {
        fontWeight: 700,
        color: '#1a3c6e',
    },
    footerRow: {
        position: 'absolute',
        bottom: 70,
        left: 60,
        right: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerBlock: {
        alignItems: 'center',
        width: 160,
    },
    footerLine: {
        borderTop: '1pt solid #333',
        width: '100%',
        marginBottom: 4,
    },
    footerLabel: {
        fontSize: 9,
        color: '#555',
    },
    certId: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
    },
});

export default function Certificate({ data }) {
    const {
        batchNo,
        course,
        student: { fullName, studentId },
    } = data;

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.border} />
                <View style={styles.innerBorder} />

                <View style={styles.content}>
                    <Text style={styles.title}>CERTIFICATE</Text>
                    <Text style={styles.subtitle}>OF COMPLETION</Text>

                    <Text style={styles.presentedTo}>
                        This certificate is proudly presented to
                    </Text>
                    <Text style={styles.studentName}>{fullName}</Text>

                    <Text style={styles.bodyText}>
                        for successfully completing the{' '}
                        <Text style={styles.courseName}>{course.name}</Text> course
                        at Al-Madina IT Computer Training Institute,
                        demonstrating dedication and proficiency in the subject matter.
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.footerBlock}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerLabel}>Batch No</Text>
                        <Text style={styles.footerLabel}>{batchNo}</Text>
                    </View>
                    <View style={styles.footerBlock}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerLabel}>Date Issued</Text>
                    </View>
                    <View style={styles.footerBlock}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerLabel}>Director</Text>
                    </View>
                </View>

                <Text style={styles.certId}>Certificate ID: {studentId}</Text>
            </Page>
        </Document>
    );
}