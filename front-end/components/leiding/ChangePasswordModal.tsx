import React, { useState } from 'react';
import { Leiding } from '@/types';
import LeidingService from '@/services/LeidingService';

type Props = {
    leiding: Leiding;
    onClose: () => void;
    onEdit: (updatedLeiding: Leiding) => void;
};


const ChangePasswordModal: React.FC<Props> = ({ leiding, onClose, onEdit }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            setNewPassword('');
            setConfirmPassword('');
            return;
        }
        try {
            const res = await LeidingService.changePassword(leiding.totem, newPassword);
            if (res === "Wachtwoord is aangepast") {
                alert('Wachtwoord is aangepast');
            }
            onClose();
        } catch (error) {
            setError('Er is een fout opgetreden bij het wijzigen van het wachtwoord.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-300 p-6 rounded-lg w-1/2 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Wachtwoord wijzigen</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nieuw wachtwoord</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-gray-400 p-2 w-full rounded"
                    />
                    <label className="block text-gray-700 mb-2 mt-4">Bevestig nieuw wachtwoord</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-400 p-2 w-full rounded"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800 mt-4"
                        onClick={handleChangePassword}
                    >
                        Wachtwoord wijzigen
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-2 ml-2"
                        onClick={onClose}
                    >   
                    Annuleren
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;