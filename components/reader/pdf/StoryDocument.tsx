import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Story } from '../../types';

// Register a standard font (optional, using default Helvetica for now)
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40,
    },
    coverPage: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    coverImage: {
        width: 400,
        height: 400,
        borderRadius: 20,
        marginBottom: 30,
        objectFit: 'cover',
    },
    title: {
        fontSize: 32,
        marginBottom: 10,
        textAlign: 'center',
        color: '#1a1a1a',
        fontFamily: 'Helvetica-Bold',
    },
    author: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
    },
    contentContainer: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 20,
        height: '80%',
    },
    pageImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
        objectFit: 'cover',
    },
    pageText: {
        fontSize: 14,
        lineHeight: 1.6,
        color: '#333',
        fontFamily: 'Helvetica',
        textAlign: 'justify',
    },
    logoFooter: {
        position: 'absolute',
        bottom: 20,
        right: 40,
        fontSize: 8,
        color: '#ccc',
    },
});

interface StoryDocumentProps {
    story: Story;
}

const StoryDocument: React.FC<StoryDocumentProps> = ({ story }) => (
    <Document title={story.title} author={story.author} creator="DreamWeave Tales">
        {/* Cover Page */}
        <Page size="A4" style={styles.coverPage}>
            <Image src={story.coverUrl || "https://picsum.photos/800/800"} style={styles.coverImage} />
            <Text style={styles.title}>{story.title}</Text>
            <Text style={styles.author}>Woven by {story.author}</Text>
            <Text style={styles.logoFooter}>Created with DreamWeave Tales AI</Text>
        </Page>

        {/* Story Pages */}
        {story.pages.map((page, index) => (
            <Page key={page.id} size="A4" style={styles.page}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {page.illustrationUrl && (
                        <Image
                            src={page.illustrationUrl}
                            style={styles.pageImage}
                        />
                    )}
                    <Text style={styles.pageText}>
                        {page.content}
                    </Text>

                    {page.choices && page.choices.length > 0 && (
                        <View style={{ marginTop: 30 }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10 }}>Make Your Choice:</Text>
                            {page.choices.map((choice, i) => {
                                const targetPageNum = story.pages.find(p => p.id === choice.leadsTo)?.pageNumber || '?';
                                return (
                                    <Text key={i} style={{ fontSize: 11, marginBottom: 5, color: '#555' }}>
                                        • {choice.text} (Turn to Page {targetPageNum})
                                    </Text>
                                );
                            })}
                        </View>
                    )}
                </View>
                <Text style={styles.pageNumber}>Page {page.pageNumber}</Text>
            </Page>
        ))}
    </Document>
);

export default StoryDocument;
