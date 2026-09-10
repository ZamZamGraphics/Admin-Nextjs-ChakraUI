'use client';
import { PDFViewer } from '@react-pdf/renderer';
import Certificate from './Certificate';

export default function CertificatePreview({ data }) {
    return (
        <PDFViewer width="100%" height={600} showToolbar={true}>
            <Certificate data={data} />
        </PDFViewer>
    );
}