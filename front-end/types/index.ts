export type Activiteit = {
    id: number;
    naam: string;
    beschrijving: string;
    begindatum: Date;
    einddatum: Date;
};

export type Groep = {
    id: number;
    naam: string;
    beschrijving: string;
    activiteiten: Activiteit[];
    leiding: boolean;
};

export type Leiding = {
    id: number;
    naam: string;
    voornaam: string;
    email: string;
    telefoon: string;
    hoofdleiding: boolean;
    totem: string;
    groep: Groep;
};

export type Nieuwsbericht = {
    id: number;
    titel: string;
    inhoud: string;
    datum: Date;
    auteur: Leiding;
};
