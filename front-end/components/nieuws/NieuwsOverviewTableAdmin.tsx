import React, { useState, useEffect } from 'react';
import { Nieuwsbericht } from '@/types';
import Image from "next/image";
import NieuwsAddModal from './NieuwsAddModal';
import NieuwsEditModal from './NieuwsEditModal';
import NieuwsberichtService from '@/services/NieuwsberichtService';

type Props = {
    nieuwsberichten: Array<Nieuwsbericht>,
}

const NieuwsOverviewTableAdmin: React.FC<Props> = ({ nieuwsberichten: initialNieuwsberichten }: Props) => {
    const [nieuwsberichten, setNieuwsberichten] = useState<Array<Nieuwsbericht>>(initialNieuwsberichten);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedNieuwsbericht, setSelectedNieuwsbericht] = useState<Nieuwsbericht | null>(null);
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    const isHoofdleiding = loggedInUser.role === 'HOOFDLEIDING';

    useEffect(() => {
        const fetchNieuwsberichten = async () => {
            try {
                const nieuwsberichten = await NieuwsberichtService.getAllNieuwsberichten();
                setNieuwsberichten(nieuwsberichten);
            } catch (error) {
                console.error('Failed to fetch nieuwsberichten:', error);
            }
        };
        fetchNieuwsberichten();
    }, []);

    const handleAddNieuwsbericht = (newNieuwsbericht: Nieuwsbericht) => {
        setNieuwsberichten([...nieuwsberichten, newNieuwsbericht]);
        setShowAddModal(false);
    };

    const handleEditNieuwsbericht = (updatedNieuwsbericht: Nieuwsbericht) => {
        setNieuwsberichten(nieuwsberichten.map(nieuwsbericht => 
            nieuwsbericht.id === updatedNieuwsbericht.id ? updatedNieuwsbericht : nieuwsbericht
        ));
        setShowEditModal(false);
    };

    const handleDeleteNieuwsbericht = async (nieuwsberichtId: number) => {
        if (window.confirm('Weet je zeker dat je dit nieuwsbericht wilt verwijderen?')) {
            try {
                await NieuwsberichtService.deleteNieuwsbericht(nieuwsberichtId);
                setNieuwsberichten(nieuwsberichten.filter(nieuwsbericht => nieuwsbericht.id !== nieuwsberichtId));
            } catch (error) {
                console.error('Failed to delete nieuwsbericht:', error);
            }
        }
    };

    const handleEditClick = (nieuwsbericht: Nieuwsbericht) => {
        setSelectedNieuwsbericht(nieuwsbericht);
        setShowEditModal(true);
    };

    return (
        <div className="p-4">
            {isHoofdleiding && (
                <div className="flex justify-end mb-4">
                    <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800"
                            onClick={() => setShowAddModal(true)}>Nieuwsbericht toevoegen
                    </button>
                </div>
            )}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-600 border-b-2 border-amber-900">
                        <th scope="col" className="p-2 border-r border-amber-900">Titel</th>
                        <th scope="col" className="p-2 border-r border-amber-900">Inhoud</th>
                        <th scope="col" className="p-2 border-r border-amber-900">Auteur</th>
                        {isHoofdleiding && <th scope="col" className="p-2 border-r border-amber-900">Acties</th>}
                    </tr>
                </thead>
                <tbody>
                    {nieuwsberichten.map((nieuwsbericht, index) => (
                        <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-amber-900`}>
                            <td className="p-2 border-r border-amber-900">{nieuwsbericht.titel}</td>
                            <td className="p-2 border-r border-amber-900">{nieuwsbericht.inhoud}</td>
                            <td className="p-2 border-r border-amber-900">{nieuwsbericht.auteur}</td>
                            {isHoofdleiding && (
                                <td className="p-2 border-r border-amber-900 text-center">
                                    <Image
                                        src="/edit-button.svg"
                                        alt="Bewerken"
                                        width={16}
                                        height={16}
                                        className="inline-block mr-2 cursor-pointer"
                                        onClick={() => handleEditClick(nieuwsbericht)}
                                    />
                                    <Image
                                        src="/delete-button.svg"
                                        alt="Verwijderen"
                                        width={16}
                                        height={16}
                                        className="inline-block ml-2 cursor-pointer"
                                        onClick={() => handleDeleteNieuwsbericht(nieuwsbericht.id)}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && (
                <NieuwsAddModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddNieuwsbericht}
                />
            )}
            {showEditModal && selectedNieuwsbericht && (
                <NieuwsEditModal
                    nieuwsbericht={selectedNieuwsbericht}
                    onClose={() => setShowEditModal(false)}
                    onEdit={handleEditNieuwsbericht}
                />
            )}
        </div>
    );
};

export default NieuwsOverviewTableAdmin;