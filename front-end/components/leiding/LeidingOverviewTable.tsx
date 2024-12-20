import React, { useState } from 'react';
import { Leiding } from '@/types';
import Image from "next/image";
import LeidingAddModal from './LeidingAddModal';

type Props = {
    leiding: Array<Leiding>,
    onEdit: (leiding: Leiding) => void;
    onDelete: (leidingId: number) => void;
}

const LeidingOverviewTable: React.FC<Props> = ({ leiding: initialLeiding, onEdit, onDelete }: Props) => {
    const [leiding, setLeiding] = useState<Array<Leiding>>(initialLeiding);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    const isHoofdleidingOrAdmin = loggedInUser.role === 'HOOFDLEIDING' || loggedInUser.role === 'ADMIN';

    const handleAddLeiding = (newLeiding: Leiding) => {
        setLeiding([...leiding, newLeiding]);
        setShowAddModal(false);
    };

    const handleDeleteLeiding = async (leidingId: number) => {
        if (window.confirm('Weet je zeker dat je deze leider wilt verwijderen?')) {
            try {
                await onDelete(leidingId);
                setLeiding(leiding.filter(lid => lid.id !== leidingId));
            } catch (error) {
                console.error('Failed to delete leiding:', error);
            }
        }
    };

    return (
        <div className="p-4">
            {isHoofdleidingOrAdmin && (
                <div className="flex justify-end mb-4">
                    <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800"
                            onClick={() => setShowAddModal(true)}>Leider toevoegen
                    </button>
                </div>
            )}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-amber-600 border-b-2 border-amber-900">
                        <th scope="col" className="p-2 border-r border-amber-900">Naam</th>
                        <th scope="col" className="p-2 border-r border-amber-900">Totem</th>
                        <th scope="col" className="p-2 border-r border-amber-900">Gsm/Telefoon</th>
                        <th scope="col" className="p-2 border-r border-amber-900">Groep</th>
                        {loggedInUser && <th scope="col" className="p-2 border-r border-amber-900">Acties</th>}
                    </tr>
                </thead>
                <tbody>
                    {leiding.map((lid, index) => (
                        <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-amber-900`}>
                            <td className="p-2 border-r border-amber-900">{lid.naam + " " + lid.voornaam}</td>
                            <td className="p-2 border-r border-amber-900">{lid.totem}</td>
                            <td className="p-2 border-r border-amber-900">{lid.telefoon}</td>
                            <td className="p-2 border-r border-amber-900">{lid.groep}</td>
                            {loggedInUser && (
                                <td className="p-2 border-r border-amber-900 text-center">
                                    {(isHoofdleidingOrAdmin || loggedInUser.totem === lid.totem) && (
                                        <Image
                                            src="/edit-button.svg"
                                            alt="Bewerken"
                                            width={16}
                                            height={16}
                                            className="inline-block mr-2 cursor-pointer"
                                            onClick={() => onEdit(lid)}
                                        />
                                    )}
                                    {isHoofdleidingOrAdmin && (
                                        <Image
                                            src="/delete-button.svg"
                                            alt="Verwijderen"
                                            width={16}
                                            height={16}
                                            className="inline-block ml-2 cursor-pointer"
                                            onClick={() => handleDeleteLeiding(lid.id)}
                                        />
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && (
                <LeidingAddModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddLeiding}
                />
            )}
        </div>
    );
};

export default LeidingOverviewTable;