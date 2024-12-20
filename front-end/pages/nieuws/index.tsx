import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import NieuwsOverviewTable from '@/components/nieuws/NieuwsOverviewTable';
import NieuwsOverviewTableAdmin from '@/components/nieuws/NieuwsOverviewTableAdmin';
import { Nieuwsbericht } from '@/types';
import NieuwsberichtService from '@/services/NieuwsberichtService';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Nieuws: React.FC = () => {
    const [nieuwsberichten, setNieuwsberichten] = useState<Nieuwsbericht[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

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

        const user = sessionStorage.getItem("loggedInUser");
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserRole(parsedUser.role);
            setLoggedInUser(user);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Nieuws</title>
            </Head>
            <Header />
            <main className="min-h-screen">
                <h1 className="text-5xl font-extrabold text-center text-green-900 mt-4 mb-8">Nieuws</h1>
                <div className="m-5">
                    {userRole === 'HOOFDLEIDING' ? (
                        <NieuwsOverviewTableAdmin nieuwsberichten={nieuwsberichten} />
                    ) : (
                        <NieuwsOverviewTable nieuwsberichten={nieuwsberichten} />
                    )}
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = async (context: { locale: any; }) => {
    const {locale} = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "nl", ["common"])),
        },
    };
};

export default Nieuws;