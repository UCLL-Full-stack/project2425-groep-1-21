import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Activiteit } from '@/types';
import ActiviteitService from '@/services/ActiviteitenService';
import ActiviteitenAddModal from './ActiviteitenAddModal';
import ActiviteitenEditModal from './ActiviteitenEditModal';
import Image from "next/image";

type Props = {
    activiteiten: Array<Activiteit>,
}

const ActiviteitenOverviewTable: React.FC<Props> = ({ activiteiten: initialActiviteiten }: Props) => {
    const [activiteiten, setActiviteiten] = useState<Array<Activiteit>>(initialActiviteiten);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedActiviteit, setSelectedActiviteit] = useState<Activiteit | null>(null);

    const router = useRouter();
    const { groepNaam } = router.query;
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');

    useEffect(() => {
        if (loggedInUser && loggedInUser.groep !== groepNaam) {
            router.push(`/activiteiten/${loggedInUser.groep}`);
        }
    }, [loggedInUser, groepNaam, router]);

    const handleEditClick = (activiteit: Activiteit) => {
        setSelectedActiviteit(activiteit);
        setShowEditModal(true);
    };

    const handleAddActiviteit = (newActiviteit: Activiteit) => {
        setActiviteiten([...activiteiten, newActiviteit]);
        setShowAddModal(false);
    };

    const handleEditActiviteit = (updatedActiviteit: Activiteit) => {
        setActiviteiten(activiteiten.map(activiteit => 
            activiteit.id === updatedActiviteit.id ? updatedActiviteit : activiteit
        ));
        setShowEditModal(false);
    };

    const handleDeleteClick = async (activiteitId: number) => {
        if (window.confirm('Weet je zeker dat je deze activiteit wilt verwijderen?')) {
            try {
                await ActiviteitService.deleteActiviteit(groepNaam as string, activiteitId);
                setActiviteiten(activiteiten.filter(activiteit => activiteit.id !== activiteitId));
            } catch (error) {
                console.error('Failed to delete activiteit:', error);
            }
        }
    };

    return (
        <>
            <div className="p-4">
                {loggedInUser && (
                    <div className="flex justify-end mb-4">
                        <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800"
                                onClick={() => setShowAddModal(true)}>Activiteit toevoegen
                        </button>
                    </div>
                )}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-amber-600 border-b-2 border-amber-900">
                            <th scope="col" className="p-2 border-r border-amber-900">Naam</th>
                            <th scope="col" className="p-2 border-r border-amber-900">Beschrijving</th>
                            <th scope="col" className="p-2 border-r border-amber-900">Begindatum</th>
                            <th scope="col" className="p-2 border-r border-amber-900">Einddatum</th>
                            {loggedInUser && (<th scope="col" className="p-2 border-r border-amber-900">Acties</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {activiteiten.map((activiteit, index) => (
                            <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} border-amber-900`}>
                                <td className="p-2 border-r border-amber-900">{activiteit.naam}</td>
                                <td className="p-2 border-r border-amber-900">{activiteit.beschrijving}</td>
                                <td className="p-2 border-r border-amber-900">
                                    {new Date(activiteit.begindatum).toLocaleDateString()} {new Date(activiteit.begindatum).toLocaleTimeString()}
                                </td>
                                <td className="p-2 border-r border-amber-900">
                                    {new Date(activiteit.einddatum).toLocaleDateString()} {new Date(activiteit.einddatum).toLocaleTimeString()}
                                </td>
                                {loggedInUser && (
                                    <td className="p-2 border-r border-amber-900 text-center">
                                        <Image
                                            src="/edit-button.svg"
                                            alt="Bewerken"
                                            width={16}
                                            height={16}
                                            className="inline-block mr-2 cursor-pointer"
                                            onClick={() => handleEditClick(activiteit)}
                                        />
                                        <Image
                                            src="/delete-button.svg"
                                            alt="Verwijderen"
                                            width={16}
                                            height={16}
                                            className="inline-block ml-2 cursor-pointer"
                                            onClick={() => handleDeleteClick(activiteit.id)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {activiteiten.length === 0 && (
                    <p className="text-center text-gray-600">Geen geplande activiteiten.</p>
                )}
            </div>
            {showAddModal && (
                <ActiviteitenAddModal
                    groepNaam={groepNaam as string}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddActiviteit}
                />
            )}
            {showEditModal && selectedActiviteit && (
                <ActiviteitenEditModal
                    groepNaam={groepNaam as string}
                    activiteit={selectedActiviteit}
                    onClose={() => setShowEditModal(false)}
                    onEdit={handleEditActiviteit}
                />
            )}
        </>
    );
};

export default ActiviteitenOverviewTable;