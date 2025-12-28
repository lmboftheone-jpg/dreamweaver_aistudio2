import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error('Error generating QR code:', err);
        return '';
    }
};
