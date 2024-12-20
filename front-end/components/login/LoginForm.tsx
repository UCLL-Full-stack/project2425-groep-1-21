import { useRouter } from "next/router";
import React, { useState } from "react";
import userService from "@/services/UserService";
import { StatusMessage } from '@/types';
import { useTranslation } from "next-i18next";

const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const [totem, setTotem] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [totemError, setTotemError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const validate = (): boolean => {
        let valid = true;
        setPasswordError("");
        if (totem === "") {
            setTotemError(t("login.totemRequired"));
            valid = false;
        }
        if (password === "") {
            setPasswordError(t("login.passwordRequired"));
            valid = false;
        }
        return valid;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        if (!validate()) return;

        const userLogin = { totem: totem, wachtwoord: password };
        const response = await userService.login(userLogin);

        if (response.status === 200) {
            try {
                setStatusMessages([{message : t("login.successMessage"), type : "success"}]);
                const data = await response.json();
                sessionStorage.setItem("loggedInUser", JSON.stringify({
                    'token': data.token,
                    'totem': data.totem,
                    'role': data.rol,
                    'groep' : data.groep
                }));
                setTimeout(() => {
                    router.push('/'); }, 2000);
            } catch (error) {
                setStatusMessages([{ message: t("login.serverError"), type: "error" }]);
            }
        } else {
            setStatusMessages([{ message: t("login.failedMessage"), type: "error" }]);
        }
    };

    return (
        <div className="bg-white rounded-lg p-8 w-80">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        id="totemInput"
                        type="text"
                        placeholder={t("login.totemPlaceholder")}
                        value={totem}
                        onChange={(event) => setTotem(event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {totemError && <p className="text-red-500 text-sm">{totemError}</p>}
                </div>
                <div className="mb-4">
                    <input
                        id="passwordInput"
                        type="password"
                        placeholder={t("login.passwordPlaceholder")}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                    {t("login.buttonText")}
                </button>
            </form>
            {statusMessages && (
                <div className="mt-4 text-center">
                    <ul className="inline-block text-center">
                        {statusMessages.map(({ message, type }, index) => (
                            <li key={index} className={type === "success" ? "text-green-500" : "text-red-500"}>
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LoginForm;