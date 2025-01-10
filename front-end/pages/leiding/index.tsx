import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import LeidingOverviewTable from '@/components/leiding/LeidingOverviewTable';
import LeidingEditModal from '@/components/leiding/LeidingEditModal';
import { Leiding } from '@/types';
import LeidingService from '@/services/LeidingService';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Leiders: React.FC = () => {
    const [leiders, setLeiders] = useState<Array<Leiding>>([]);
    const [selectedLeiding, setSelectedLeiding] = useState<Leiding | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLeiders = async () => {
        setError("");
        try {
            const response = await LeidingService.getLeiding();
            console.log(response);
            setLeiders(response);
        } catch (error) {
            if ((error as any).message === "Failed to get leiding.") {
                setError("You are not authorized to view this page. Please login first.");
            } else {
                setError((error as Error).message);
            }
        }
    }

    const handleEdit = (leiding: Leiding) => {
        setSelectedLeiding(leiding);
        setShowEditModal(true);
    };

    const handleDelete = async (leidingId: number) => {
        try {
            await LeidingService.deleteLeiding(leidingId);
            setLeiders(leiders.filter(lid => lid.id !== leidingId));
        } catch (error) {
            console.error('Failed to delete leiding:', error);
        }
    };

    const saved = (success: boolean) => {
        setShowEditModal(false);
        if (success) {
            getLeiders();
        }
    };

    useEffect(() => {
        getLeiders();
    }, []);

    return (
        <>
            <Head>
                <title>Leiding</title>
            </Head>
            <Header />
            <main>
                <h1 className="text-5xl font-extrabold text-center text-green-900 mt-4 mb-8">Leiding Overzicht</h1>
                <section>
                    {error && <div className="text-red-800">{error}</div>}
                    {leiders.length > 0 ? (
                        <LeidingOverviewTable leiding={leiders} onEdit={handleEdit} onDelete={handleDelete} />
                    ) : (
                        <p className="text-center text-gray-600">Geen leiding gevonden.</p>
                    )}
                </section>
            </main>
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "nl", ["common"])),
        },
    };
};

export default Leiders;