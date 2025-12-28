import React, { useState } from 'react';

interface PrintOrderModalProps {
    storyTitle: string;
    onConfirm: (address: string) => void;
    onCancel: () => void;
}

const PrintOrderModal: React.FC<PrintOrderModalProps> = ({ storyTitle, onConfirm, onCancel }) => {
    const [address, setAddress] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500">print_connect</span>
                        Order Hardcover
                    </h3>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-6 flex gap-4">
                    <div className="w-16 h-20 bg-indigo-200 dark:bg-indigo-800 rounded shadow-md"></div>
                    <div>
                        <h4 className="font-bold text-sm mb-1">{storyTitle}</h4>
                        <p className="text-xs text-gray-500 mb-2">Hardcover, Full Color, 8x10"</p>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">$29.99</p>
                    </div>
                </div>

                <label className="block text-sm font-bold mb-2">Shipping Address</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Magic Lane, Storyville, USA"
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none mb-6"
                />

                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(address)}
                        disabled={!address.trim()}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintOrderModal;
