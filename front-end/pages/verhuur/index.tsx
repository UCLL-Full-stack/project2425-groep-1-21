import React from 'react';
import Head from 'next/head';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from '@/components/header';

const Verhuur: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('verhuur.title')}</title>
            </Head>
            <Header />
            <main className="container mx-auto p-8">
                <h1 className="text-5xl font-extrabold text-green-900 mb-8">{t('verhuur.title')}</h1>
                <p className="mb-4">{t('verhuur.description')} <a href={t('verhuur.brochureLink')} className="text-blue-500 underline">{t('verhuur.brochureText')}</a></p>
                <p className="mb-4">{t('verhuur.challenge')}</p>
                <p className="mb-4">{t('verhuur.noRental')}</p>
                <p className="mb-4">{t('verhuur.conditions')} <a href={t('verhuur.conditionsLink')} className="text-blue-500 underline">{t('verhuur.conditionsText')}</a></p>
                <h2 className="text-3xl font-bold text-green-800 mb-4">{t('verhuur.contactTitle')}</h2>
                <ul className="list-disc list-inside mb-4">
                    {t('verhuur.contact', { returnObjects: true }).map((contact: any, index: number) => (
                        <li key={index}>
                            <p>{contact.name}</p>
                            <p>{contact.email}</p>
                            <p>{contact.phone}</p>
                        </li>
                    ))}
                </ul>
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

export default Verhuur;