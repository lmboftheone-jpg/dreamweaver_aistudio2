import React, { useEffect, useState } from 'react';
import { marketplaceService } from '../../services/marketplaceService';
import { MarketplaceItem } from '../../types';
import ProductCard from './ProductCard';

const Marketplace: React.FC = () => {
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        marketplaceService.getItems().then((data) => {
            setItems(data);
            setLoading(false);
        });
    }, []);

    const handleBuy = async (item: MarketplaceItem) => {
        const confirmed = confirm(`Buy "${item.title}" for ${item.price} coins?`);
        if (confirmed) {
            // Check auth in parent or service. Assuming logged in for demo.
            // For MVP we can just alert success.
            alert("Purchase successful! Item added to your inventory.");
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading treasures...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center">
                <h2 className="text-4xl font-black mb-4">DreamWeave Bazaar</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Discover new worlds, art styles, and exclusive magical artifacts to enhance your storytelling.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <ProductCard key={item.id} item={item} onBuy={handleBuy} />
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
