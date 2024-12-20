import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";


const Home: React.FC = () => {
    const { t } = useTranslation();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = sessionStorage.getItem("loggedInUser");
            const role = sessionStorage.getItem("role");
            setUserRole(role);
            setLoggedInUser(user);
            setIsClient(true);
        }
    }, []);

    return (
        <div className='flex flex-col min-h-screen'>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content="Agenda app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="container mx-auto place-items-center flex-grow">
                <table className="w-8/12 text-left border-collapse border border-black border-solid mt-10">
                    <thead>
                        <tr>
                            <th className="border border-black m-5">Naam</th>
                            <th className="border border-black m-5">Wachtwoord</th>
                            <th className="border border-black m-5">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black">Leiding1</td>
                            <td className="border border-black">leiding1</td>
                            <td className="border border-black">LEIDING (basis rol om dingen toe te voegen)</td>
                        </tr>
                        <tr>
                            <td className="border border-black">Leiding2</td>
                            <td className="border border-black">leiding2</td>
                            <td className="border border-black">LEIDING (basis rol om dingen toe te voegen)</td>
                        </tr>
                        <tr>
                            <td className="border border-black">Hoofdleiding</td>
                            <td className="border border-black">hoofdleiding</td>
                            <td className="border border-black">HOOFDLEIDING (kan bijna alles)</td>
                        </tr>
                        <tr>
                            <td className="border border-black">Admin</td>
                            <td className="border border-black">admin</td>
                            <td className="border border-black">ADMIN (kan alles wat hoofdleiding niet kan, maar kan enkele hoofdleiding specifieke dingen niet)</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
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

export default Home;
