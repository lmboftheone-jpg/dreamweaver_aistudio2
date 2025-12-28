'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main App component to ensure it runs only on the client
// because it relies heavily on localStorage and window objects.
const ClientApp = dynamic(() => import('../components/ClientApp'), { ssr: false });

export default function Home() {
    return <ClientApp />;
}
