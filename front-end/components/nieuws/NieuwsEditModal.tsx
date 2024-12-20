import React, { useState } from 'react';
import NieuwsberichtService from '@/services/NieuwsberichtService';
import { Nieuwsbericht } from '@/types';

type Props = {
    nieuwsbericht: Nieuwsbericht;
    onClose: () => void;
    onEdit: (nieuwsbericht: Nieuwsbericht) => void;
};

const NieuwsEditModal: React.FC<Props> = ({ nieuwsbericht, onClose, onEdit }) => {
    const [updatedNieuwsbericht, setUpdatedNieuwsbericht] = useState(nieuwsbericht);
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

    const validate = (): boolean => {
        let valid = true;
        setTitleError('');
        setContentError('');

        if (updatedNieuwsbericht.titel === '') {
            setTitleError('Titel is verplicht.');
            valid = false;
        }
        if (updatedNieuwsbericht.inhoud === '') {
            setContentError('Inhoud is verplicht.');
            valid = false;
        }
        return valid;
    };

    const editNieuwsbericht = async () => {
        if (!validate()) return;

        try {
            const response = await NieuwsberichtService.updateNieuwsbericht(
                updatedNieuwsbericht.id,
                updatedNieuwsbericht.titel,
                updatedNieuwsbericht.inhoud,
                updatedNieuwsbericht.datum,
                updatedNieuwsbericht.auteur
            );
            onEdit(response);
            onClose();
        } catch (error) {
            console.error('Failed to update nieuwsbericht:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-300 p-6 rounded-lg w-5/12 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Nieuwsbericht bewerken</h2>
                <label className="block mb-3">
                    Titel:
                    <input
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                        value={updatedNieuwsbericht.titel}
                        onChange={(e) => setUpdatedNieuwsbericht({ ...updatedNieuwsbericht, titel: e.target.value })}
                    />
                    {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                </label>
                <label className="block mb-3">
                    Inhoud:
                    <textarea
                        className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                        value={updatedNieuwsbericht.inhoud}
                        onChange={(e) => setUpdatedNieuwsbericht({ ...updatedNieuwsbericht, inhoud: e.target.value })}
                    />
                    {contentError && <p className="text-red-500 text-sm">{contentError}</p>}
                </label>
                <div className="text-center mt-4">
                    <button
                        className="bg-green-900 text-white px-4 py-2 rounded shadow-md hover:bg-green-950 mr-2"
                        onClick={editNieuwsbericht}>Opslaan
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

export default NieuwsEditModal;