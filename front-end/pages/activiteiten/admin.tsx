import Head from 'next/head';
import ActiviteitenOverviewTable from '@/components/activiteiten/ActiviteitenOverviewTable';
import { useEffect, useState } from 'react';
import { Activiteit } from '@/types';
import ActiviteitService from '@/services/ActiviteitenService';
import Header from '@/components/header';

const Activiteiten: React.FC = () => {
    const [activiteiten, setActiviteiten] = useState<Array<Activiteit>>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newActiviteit, setNewActiviteit] = useState({
        name: '',
        description: '',
        beginDate: new Date().toLocaleDateString(),
        endDate: new Date().toLocaleDateString()
    });

    const getActiviteiten = async () => {
        const response = await ActiviteitService.getAllActiviteiten();
        const activiteiten = await response.json();
        setActiviteiten(activiteiten);
    }

    useEffect(() => {
        getActiviteiten()
    }, []);

    const addActiviteit = async () => {
        await ActiviteitService.addActiviteit(
            newActiviteit.name,
            newActiviteit.description,
            new Date(newActiviteit.beginDate),
            new Date(newActiviteit.endDate)
        );
        setShowModal(false);
        setNewActiviteit({ name: '', description: '', beginDate: '', endDate: '' });
        getActiviteiten();
    };

    return (
        <>
            <Head>
                <title>Activiteiten</title>
            </Head>
            <Header />
            <main>
                <h1 className="text-5xl font-extrabold text-center text-green-900 mt-4 mb-8">Alle Activiteiten</h1>

                <div className="flex justify-end mr-4">
                    <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-800"
                            onClick={() => setShowModal(true)}>Activiteit toevoegen
                    </button>
                </div>

                <section className="relative mt-8">
                    {activiteiten && activiteiten.length > 0 ? (
                        <ActiviteitenOverviewTable activiteiten={activiteiten} />
                    ) : (
                        <p className="text-center text-gray-600">Geen geplande activiteiten.</p>
                    )}
                </section>

                {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-gray-300 p-6 rounded-lg w-96 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Activiteit toevoegen</h2>
                            <label className="block mb-3">
                                Naam:
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                    value={newActiviteit.name}
                                    onChange={(e) => setNewActiviteit({ ...newActiviteit, name: e.target.value })}
                                />
                            </label>
                            <label className="block mb-3">
                                Beschrijving:
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                    value={newActiviteit.description}
                                    onChange={(e) => setNewActiviteit({
                                        ...newActiviteit,
                                        description: e.target.value
                                    })}
                                />
                            </label>
                            <label className="block mb-3">
                                Begindatum en uur:
                                <input
                                    type="datetime-local"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                    value={newActiviteit.beginDate}
                                    onChange={(e) => setNewActiviteit({ ...newActiviteit, beginDate: e.target.value })}
                                />
                            </label>
                            <label className="block mb-3">
                                Einddatum en uur:
                                <input
                                    type="datetime-local"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-200 shadow-md"
                                    value={newActiviteit.endDate}
                                    onChange={(e) => setNewActiviteit({ ...newActiviteit, endDate: e.target.value })}
                                />
                            </label>
                            <div className="text-center">
                                <button
                                    className="bg-green-900 text-white px-4 py-2 rounded shadow-md hover:bg-green-950 mr-2"
                                    onClick={addActiviteit}>Toevoegen
                                </button>
                                <button
                                    className="bg-amber-800 text-white px-4 py-2 rounded shadow-md hover:bg-amber-900"
                                    onClick={() => setShowModal(false)}>Annuleren
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default Activiteiten;