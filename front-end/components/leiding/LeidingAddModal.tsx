import React, { useState } from 'react';
import LeidingService from '@/services/LeidingService';
import { Leiding } from '@/types';

type Props = {
    onClose: () => void;
    onAdd: (leiding: Leiding) => void;
};

const LeidingAddModal: React.FC<Props> = ({ onClose, onAdd }) => {
    const [newLeiding, setNewLeiding] = useState({
        naam: '',
        voornaam: '',
        telefoon: '',
        email: '',
        totem: '',
        rol: 'LEIDING',
        wachtwoord: ''
    });
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [totemError, setTotemError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validate = (): boolean => {
        let valid = true;
        setNameError('');
        setSurnameError('');
        setPhoneError('');
        setEmailError('');
        setTotemError('');
        setPasswordError('');

        if (newLeiding.naam === '') {
            setNameError('Naam is verplicht.');
            valid = false;
        }
        if (newLeiding.voornaam === '') {
            setSurnameError('Voornaam is verplicht.');
            valid = false;
        }
        if (newLeiding.telefoon === '') {
            setPhoneError('Telefoon is verplicht.');
            valid = false;
        }
        if (newLeiding.email === '') {
            setEmailError('Email is verplicht.');
            valid = false;
        }
        if (newLeiding.totem === '') {
            setTotemError('Totem is verplicht.');
            valid = false;
        }
        if (newLeiding.wachtwoord === '') {
            setPasswordError('Wachtwoord is verplicht.');
            valid = false;
        }
        return valid;
    };

    const addLeiding = async () => {
        if (!validate()) return;

        try {
            const response = await LeidingService.addLeiding(
                newLeiding.naam,
                newLeiding.voornaam,
                newLeiding.telefoon,
                newLeiding.email,
                newLeiding.totem,
                newLeiding.rol,
                newLeiding.wachtwoord
            );
            onAdd(response);
            onClose();
        } catch (error) {
            console.error('Failed to add leiding:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-300 p-6 rounded-lg w-128 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Leider toevoegen</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-3">
                            Naam:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.naam}
                                onChange={(e) => setNewLeiding({ ...newLeiding, naam: e.target.value })}
                            />
                            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                        </label>
                        <label className="block mb-3">
                            Voornaam:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.voornaam}
                                onChange={(e) => setNewLeiding({ ...newLeiding, voornaam: e.target.value })}
                            />
                            {surnameError && <p className="text-red-500 text-sm">{surnameError}</p>}
                        </label>
                        <label className="block mb-3">
                            Telefoon:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.telefoon}
                                onChange={(e) => setNewLeiding({ ...newLeiding, telefoon: e.target.value })}
                            />
                            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                        </label>
                        <label className="block mb-3">
                            Email:
                            <input
                                type="email"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.email}
                                onChange={(e) => setNewLeiding({ ...newLeiding, email: e.target.value })}
                            />
                            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                        </label>
                    </div>
                    <div>
                        <label className="block mb-3">
                            Totem:
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.totem}
                                onChange={(e) => setNewLeiding({ ...newLeiding, totem: e.target.value })}
                            />
                            {totemError && <p className="text-red-500 text-sm">{totemError}</p>}
                        </label>
                        <label className="block mb-3">
                            Rol:
                            <select
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.rol}
                                onChange={(e) => setNewLeiding({ ...newLeiding, rol: e.target.value })}
                            >
                                <option value="HOOFDLEIDING">HOOFDLEIDING</option>
                                <option value="LEIDING">LEIDING</option>
                            </select>
                        </label>
                        <label className="block mb-3">
                            Wachtwoord:
                            <input
                                type="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                value={newLeiding.wachtwoord}
                                onChange={(e) => setNewLeiding({ ...newLeiding, wachtwoord: e.target.value })}
                            />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        </label>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button
                        className="bg-green-900 text-white px-4 py-2 rounded shadow-md hover:bg-green-950 mr-2"
                        onClick={addLeiding}>Toevoegen
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

export default LeidingAddModal;