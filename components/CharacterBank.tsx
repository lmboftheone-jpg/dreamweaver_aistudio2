import React, { useState, useEffect } from 'react';
import { characterService, Character } from '../services/characterService';
import { useAuth } from '../contexts/AuthContext';

interface CharacterBankProps {
    onSelect: (character: Character) => void;
}

const CharacterBank: React.FC<CharacterBankProps> = ({ onSelect }) => {
    const { user } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New Character Form
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        if (user) {
            loadCharacters();
        }
    }, [user]);

    const loadCharacters = async () => {
        if (!user) return;
        setIsLoading(true);
        const data = await characterService.getCharacters(user.id);
        setCharacters(data);
        setIsLoading(false);
    };

    const handleAdd = async () => {
        if (!user || !newName || !newDesc) return;
        const newChar = await characterService.createCharacter(user.id, {
            name: newName,
            description: newDesc,
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newName}` // Auto-generate placeholder
        });
        if (newChar) {
            setCharacters([newChar, ...characters]);
            setNewName('');
            setNewDesc('');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Remove this character?")) {
            await characterService.deleteCharacter(id);
            setCharacters(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Add Card */}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-3">
                    <h4 className="font-bold text-sm uppercase text-gray-400">New Character</h4>
                    <input
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
                        placeholder="Name (e.g. Zog)"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <textarea
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary resize-none h-20"
                        placeholder="Appearance (e.g. Blue wizard hat, white beard, carries a staff)"
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newName || !newDesc}
                        className="bg-primary text-white font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        Save Character
                    </button>
                </div>

                {/* Character List */}
                {characters.map(char => (
                    <div
                        key={char.id}
                        onClick={() => onSelect(char)}
                        className="group relative border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <img src={char.avatar_url} alt={char.name} className="w-12 h-12 rounded-full bg-gray-100" />
                            <div>
                                <h4 className="font-bold">{char.name}</h4>
                                <p className="text-xs text-gray-500 line-clamp-3">{char.description}</p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => handleDelete(char.id, e)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>

                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-colors pointer-events-none" />
                    </div>
                ))}

                {isLoading && <div className="text-center py-8 text-gray-400 col-span-full">Loading grimoire...</div>}
            </div>
        </div>
    );
};

export default CharacterBank;
