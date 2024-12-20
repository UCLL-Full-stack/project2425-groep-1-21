import LoginForm from "@/components/login/LoginForm";
import React from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Login: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('login.title')}</title>
            </Head>
            <Header />
            <main className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-5xl font-extrabold text-green-900">{t('login.pageTitle')}</h1>
                <div className="m-5">
                    <LoginForm />
                </div>
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

export default Login;