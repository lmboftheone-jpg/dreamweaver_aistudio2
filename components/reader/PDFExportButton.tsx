'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StoryPDF from './StoryPDF';
import { Story } from '../../types';

interface PDFExportButtonProps {
    story: Partial<Story>;
    coverUrl: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ story, coverUrl }) => {
    return (
        <PDFDownloadLink
            document={<StoryPDF story={story} coverUrl={coverUrl} />}
            fileName={`${story.title || 'story'}.pdf`}
            className="flex-1 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full text-xs font-bold hover:bg-gray-700 transition-all"
        >
            {({ loading }) => (loading ? 'Preparing PDF...' : 'Export PDF')}
        </PDFDownloadLink>
    );
};

export default PDFExportButton;
