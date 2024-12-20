import React, { useEffect, useState } from 'react';
import { Groep, Leiding } from '@/types';
import LeidingService from '@/services/LeidingService';
import GroepService from '@/services/GroepService';

type Props = {
    leiding: Leiding;
    onClose: () => void;
    onEdit: (updatedLeiding: Leiding) => void;
};

const HoofdleidingEditModal: React.FC<Props> = ({ leiding, onClose, onEdit }) => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    const isEditingOwnProfile = loggedInUser.totem === leiding.totem;
    const [selected, setSelected] = useState<string>("Losse leden");

    const [editedLeiding, setEditedLeiding] = useState({
        naam: leiding.naam,
        voornaam: leiding.voornaam,
        telefoon: leiding.telefoon,
        email: leiding.email,
        groep: leiding.groep,
    });
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [groepen, setGroepen] = useState<Groep[]>([]);

    const validate = (): boolean => {
        let valid = true;
        setNameError('');
        setSurnameError('');
        setPhoneError('');
        setEmailError('');

        if (editedLeiding.naam === '') {
            setNameError('Naam is verplicht.');
            valid = false;
        }
        if (editedLeiding.voornaam === '') {
            setSurnameError('Voornaam is verplicht.');
            valid = false;
        }
        if (editedLeiding.telefoon === '') {
            setPhoneError('Telefoon is verplicht.');
            valid = false;
        }
        if (editedLeiding.email === '') {
            setEmailError('Email is verplicht.');
            valid = false;
        }
        return valid;
    };

    const editLeiding = async () => {
        if (!validate()) return;

        try {
            let updatedLeiding;
            if (isEditingOwnProfile) {
                updatedLeiding = await LeidingService.updateLeiding(
                    leiding.id,
                    editedLeiding.naam,
                    editedLeiding.voornaam,
                    editedLeiding.telefoon,
                    editedLeiding.email
                );
            } else {
                updatedLeiding = await LeidingService.changeGroup(leiding.id, selected);
            }
            onEdit(updatedLeiding);
            onClose();
        } catch (error) {
            console.error('Failed to edit leiding:', error);
        }
    };

    useEffect(() => {
        const fetchGroepen = async () => {
            const groepen = await GroepService.getAllGroepenWithAuth();
            const parsedGroepen = await groepen.json();
            setGroepen(parsedGroepen);
            console.log(parsedGroepen);
        };
        fetchGroepen();
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-300 p-6 rounded-lg w-128 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Leiding bewerken</h2>
                {isEditingOwnProfile ? (
                    <>
                        <label className="block mb-3">
                            Naam:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={editedLeiding.naam}
                                onChange={(e) => setEditedLeiding({ ...editedLeiding, naam: e.target.value })}
                            />
                            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                        </label>
                        <label className="block mb-3">
                            Voornaam:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={editedLeiding.voornaam}
                                onChange={(e) => setEditedLeiding({ ...editedLeiding, voornaam: e.target.value })}
                            />
                            {surnameError && <p className="text-red-500 text-sm">{surnameError}</p>}
                        </label>
                        <label className="block mb-3">
                            Telefoon:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={editedLeiding.telefoon}
                                onChange={(e) => setEditedLeiding({ ...editedLeiding, telefoon: e.target.value })}
                            />
                            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                        </label>
                        <label className="block mb-3">
                            Email:
                            <input
                                type="email"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={editedLeiding.email}
                                onChange={(e) => setEditedLeiding({ ...editedLeiding, email: e.target.value })}
                            />
                            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                        </label>
                    </>
                ) : (
                    <label className="block mb-3">
                        Groep:
                        <select
                        onChange={(e) => {setSelected(e.target.value)}}
                        >
                            <option value={editedLeiding.groep}>--- selecteer een groep ---</option>
                            {groepen.map((groep) => (
                                <option key={groep.id} value={groep.naam}>
                                    {groep.naam}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <div className="text-center">
                    <button
                        className="bg-green-900 text-white px-4 py-2 rounded shadow-md hover:bg-green-950 mr-2"
                        onClick={editLeiding}>Opslaan
                    </button>
                    <button
                        className="bg-amber-800 text-white px-4 py-2 rounded shadow-md hover:bg-amber-900"
                        onClick={onClose}>Annuleren
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HoofdleidingEditModal;