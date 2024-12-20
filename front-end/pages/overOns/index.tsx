import React from 'react';
import Head from 'next/head';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from '@/components/header';

const OverOns: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('overOns.title')}</title>
            </Head>
            <Header />
            <main className="container mx-auto p-8">
                <h1 className="text-5xl font-extrabold text-green-900 mb-8">{t('overOns.title')}</h1>
                <p className="mb-4">{t('overOns.description')}</p>
                <h2 className="text-3xl font-bold text-green-800 mb-4">{t('overOns.takkenTitle')}</h2>
                <p className="mb-4">{t('overOns.takkenDescription')}</p>
                <ul className="list-disc list-inside mb-4">
                    {t('overOns.takkenList', { returnObjects: true }).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <h2 className="text-3xl font-bold text-green-800 mb-4">{t('overOns.lokalenTitle')}</h2>
                <p className="mb-4">{t('overOns.lokalenDescription')}</p>
                <h2 className="text-3xl font-bold text-green-800 mb-4">{t('overOns.uniformTitle')}</h2>
                <p className="mb-4">{t('overOns.uniformDescription')}</p>
                <ul className="list-disc list-inside mb-4">
                    {t('overOns.uniformList', { returnObjects: true }).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p className="mb-4">{t('overOns.uniformExtra')}</p>
                <h2 className="text-3xl font-bold text-green-800 mb-4">{t('overOns.kampTitle')}</h2>
                <p className="mb-4">{t('overOns.kampDescription')}</p>
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

export default OverOns;