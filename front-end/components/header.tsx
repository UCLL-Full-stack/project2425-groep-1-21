import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Groep } from '@/types';
import Language from "@/components/language/Language";
import { useTranslation } from "next-i18next";
import GroepService from '@/services/GroepService';


const Header: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const [groepen, setGroepen] = useState<Groep[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<{ totem: string, groep: string } | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        const user = sessionStorage.getItem("loggedInUser");
        if (user) {
            setLoggedInUser(JSON.parse(user));
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchGroepen = async () => {
            const response = await GroepService.getAllGroepen();
            const groepenArray = await response.json();
            setGroepen(groepenArray);
        }
        fetchGroepen();
    }, []);

    const handleClick = () => {
        sessionStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
    }

    return (
        <header className="bg-green-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold">Agenda Scouts Overijse</h1>
                <nav>
                    <div className="flex space-x-4 items-center">
                        <Link className="hover:bg-green-600 px-3 py-2 rounded" href={"/"}>
                            {t('header.loginGegevens')}
                        </Link>

                        {(!loggedInUser || loggedInUser.role === 'HOOFDLEIDING') && 
                        (<Link className="hover:bg-green-600 px-3 py-2 rounded" href="/nieuws">
                            {t('header.home')}
                        </Link>)}
                        {loggedInUser ? (
                            <>
                                <Link
                                    className="hover:bg-green-600 px-3 py-2 rounded"
                                    href={`/activiteiten/${loggedInUser.groep}`}
                                >
                                    {loggedInUser.groep}
                                </Link>
                                <Link
                                    className="hover:bg-green-600 px-3 py-2 rounded"
                                    href="/leiding"
                                >
                                    {t('header.leiding')}
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    className="hover:bg-green-600 px-3 py-2 rounded"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {t('header.takken')}
                                </button>
                                {dropdownOpen && (
                                    <ul ref={dropdownRef} className="absolute left-0 bg-green-600 text-white mt-2 rounded shadow-lg z-10">
                                        {groepen && groepen.map((groep, index) => (
                                            <li key={index} className="hover:bg-green-700 px-3 py-2">
                                                <Link href={`/${groep.naam}`}>{groep.naam}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {!loggedInUser && (
                            <Link className="hover:bg-green-600 px-3 py-2 rounded" href="/overOns">
                                {t('header.overOns')}
                            </Link>
                        )}
                        {!loggedInUser &&(
                            <Link className="hover:bg-green-600 px-3 py-2 rounded" href="/verhuur">
                                {t('header.verhuur')}
                            </Link>
                        )}
                        {loggedInUser ? (
                            <>
                                <a
                                    href="/"
                                    className="hover:bg-green-600 px-3 py-2 rounded"
                                    onClick={handleClick}
                                >
                                    {t('header.logout')}
                                </a>
                                <div>{t('header.welcome')} {loggedInUser.totem}</div>
                            </>
                        ) : (
                            <Link className="hover:bg-green-600 px-3 py-2 rounded" href="/login">
                                {t('header.login')}
                            </Link>
                        )}

                        <Language />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;