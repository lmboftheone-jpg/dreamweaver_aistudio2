import React from 'react';
import { MarketplaceItem } from '../../types';

interface ProductCardProps {
    item: MarketplaceItem;
    onBuy: (item: MarketplaceItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onBuy }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800">
            <div className="h-48 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                        {item.type.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center text-sm font-bold text-amber-500">
                        <span className="material-symbols-outlined text-base mr-1">monetization_on</span>
                        {item.price}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                <button
                    onClick={() => onBuy(item)}
                    className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                    Purchase
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
