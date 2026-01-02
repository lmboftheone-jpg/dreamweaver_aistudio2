'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Story } from '../../types';

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
    },
    coverPage: {
        padding: 0,
        backgroundColor: '#000',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    titlePage: {
        padding: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
    },
    author: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    heroContext: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    contentPage: {
        padding: 40,
        flexDirection: 'column',
    },
    pageImage: {
        width: '100%',
        height: 300,
        objectFit: 'cover',
        marginBottom: 30,
        borderRadius: 10,
    },
    pageText: {
        fontSize: 14,
        lineHeight: 1.6,
        color: '#333',
        marginBottom: 20,
        fontFamily: 'Helvetica',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 10,
        color: '#999',
    },
});

interface StoryPDFProps {
    story: Partial<Story>;
    coverUrl?: string; // Explicit cover URL if available
}

const StoryPDF: React.FC<StoryPDFProps> = ({ story, coverUrl }) => {
    return (
        <Document>
            {/* Cover Page */}
            {(coverUrl || story.coverUrl || story.pages?.[0]?.illustrationUrl) && (
                <Page size="A4" style={styles.coverPage}>
                    <Image
                        src={coverUrl || story.coverUrl || story.pages?.[0]?.illustrationUrl || "https://picsum.photos/800/1200"}
                        style={styles.coverImage}
                    />
                </Page>
            )}

            {/* Title Page */}
            <Page size="A4" style={styles.titlePage}>
                <Text style={styles.title}>{story.title || "Untitled Story"}</Text>
                <Text style={styles.author}>Woven by {story.author || "DreamWeaver"}</Text>
                {story.heroDescription && (
                    <Text style={styles.heroContext}>{story.heroDescription}</Text>
                )}
            </Page>

            {/* Story Pages */}
            {story.pages?.map((page, index) => (
                <Page key={page.id || index} size="A4" style={styles.contentPage}>
                    {page.illustrationUrl && (
                        <Image src={page.illustrationUrl} style={styles.pageImage} />
                    )}
                    <Text style={styles.pageText}>{page.content}</Text>

                    <View style={{ position: 'absolute', bottom: 30, left: 40, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 50, height: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 8 }}>AR CODE</Text>
                        </View>
                        <Text style={{ fontSize: 8, marginLeft: 5, color: '#999' }}>Scan for Magic ✨</Text>
                    </View>

                    <Text style={styles.pageNumber}>{index + 1}</Text>
                </Page>
            ))}
        </Document>
    );
};

export default StoryPDF;
