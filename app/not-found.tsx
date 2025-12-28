import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-4xl font-black mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">The story you are looking for seems to have drifted into another realm.</p>
            <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                Return Home
            </Link>
        </div>
    );
}
