import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import { Activiteit, Groep } from "@/types";
import GroepService from "@/services/GroepService";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Tak: React.FC = () => {
  const [activiteiten, setActiviteiten] = useState<Array<Activiteit>>([]);
  const [groep, setGroep] = useState<Groep>();
  const router = useRouter();
  const { groepNaam } = router.query;

  const formatGroupName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchGroep = async () => {
      if (groepNaam) {
        const groepJson = await GroepService.getGroepByNaam(
          groepNaam as string
        );
        const groep = await groepJson.json();
        setGroep(groep);
        setActiviteiten(
          groep.activiteiten.sort(
            (a: Activiteit, b: Activiteit) =>
              new Date(a.begindatum).getTime() -
              new Date(b.begindatum).getTime()
          )
        );
      }
    };
    fetchGroep();
  }, [groepNaam]);

  const formattedGroupName = groepNaam
    ? formatGroupName(groepNaam as string)
    : "";

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-BE", { day: "numeric", month: "long" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("nl-BE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>{formattedGroupName}</title>
      </Head>
      <Header />
      <h1 className="place-self-center mt-5 text-6xl font-semibold">
        {formattedGroupName}
      </h1>
      {groep && (
        <>
          <p className="w-8/12 place-self-center mt-5 text-xl">
            {groep.beschrijving}
          </p>
          <h2 className="place-self-center mt-5 text-4xl font-semibold">
            Leiding
          </h2>
          <div className="grid grid-cols-2 gap-4 w-8/12 place-self-center">
            {groep.leiding.map((leiding, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg mt-4">
                <h3 className="text-xl font-semibold">
                  {leiding.voornaam +
                    " " +
                    leiding.naam +
                    " (" +
                    leiding.totem +
                    ")"}
                </h3>
                <p>{"email: " + leiding.email}</p>
                <p>{"telefoon: " + leiding.telefoon}</p>
              </div>
            ))}
          </div>
          <h2 className="place-self-center mt-5 text-4xl font-semibold">
            Activiteiten
          </h2>
          <div className="w-8/12 place-self-center">
            {activiteiten.map((activiteit, index) => {
              const beginDate = new Date(activiteit.begindatum);
              const endDate = new Date(activiteit.einddatum);
              const isSameDate =
                beginDate.toDateString() === endDate.toDateString();
              return (
                <div key={index} className="bg-gray-200 p-4 rounded-lg mt-4">
                  <h3 className="text-xl font-semibold">{activiteit.naam}</h3>
                  <p>{activiteit.beschrijving}</p>
                  <p>
                    {isSameDate
                      ? formatDate(beginDate)
                      : `${formatDate(beginDate)} - ${formatDate(endDate)}`}
                  </p>
                  <p>{`${formatTime(beginDate)} - ${formatTime(endDate)}`}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
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

export default Tak;
