import leidingRepo from '../repository/leiding.db';
import { Leiding, PublicLeiding } from '../model/leiding';
import bcrypt from 'bcrypt';
import generateSWTtoken from '../util/jwt';
import { AuthenticationResponse, Rol } from '../types';
import { UnauthorizedError } from 'express-jwt';
import groepService from './groep.service';


const login = async (totem: string, password: string): Promise<AuthenticationResponse> => {
    try {
        const leiding = await leidingRepo.getLeidingByTotem({totem});
        if (!leiding) {
            throw new Error('Totem of passwoord fout');
        }
        const valid = await bcrypt.compare(password, leiding.getWachtwoord());
        if (!valid) {
            throw new Error('Totem of passwoord fout');
        }
        const groep = await groepService.getGroepById(leiding.getGroepId());
        if (!groep) {
            throw new Error('Groep not found');
        }
        return {
            token: generateSWTtoken(leiding.getTotem(), leiding.getRol()),
            totem: leiding.getTotem(),
            rol: leiding.getRol(),
            groep: groep.getNaam()
        }
    } catch (error) {
        throw new Error('Totem of passwoord fout');
    }
}

const getAllLeiding = async (rol: Rol): Promise<PublicLeiding[]> => {
    if (rol !== 'HOOFDLEIDING' && rol !== 'LEIDING' && rol !== 'ADMIN') {
            throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    }
    try {
        const leiding = await leidingRepo.getAllLeiding()
        let pubLeiding: PublicLeiding[] = [];
        for (const l of leiding) {
            const groep = await groepService.getGroepById(l.getGroepId());
            if (!groep) {
                throw new Error('Groep not found');
            }
            pubLeiding.push(PublicLeiding.from({leiding: l, groep: groep.getNaam()}));
        }
        return pubLeiding;
    } catch (error) {
        throw error;
    }
}

const updateLeiding = async (leiding: Leiding, rol: Rol, totem: string): Promise<PublicLeiding> => {
    if (rol !== 'HOOFDLEIDING' && rol !== 'ADMIN' && rol !== 'LEIDING') {
        throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    }
    try {
        const leidingDB = await leidingRepo.getLeidingByTotem({totem});
        const groep = await groepService.getGroepById(leidingDB.getGroepId());
        if (!leidingDB) {
            throw new Error('Leiding not found');
        }else if (leidingDB.getTotem() !== totem && rol === 'LEIDING') {
            throw new UnauthorizedError('credentials_required', new Error('wrong totem'));
        }
        if (leiding.getVoornaam() === '' || leiding.getVoornaam() === null || leiding.getVoornaam() === undefined) {
            leiding.setVoornaam(leidingDB.getVoornaam());
        }
        if (leiding.getNaam() === '' || leiding.getNaam() === null || leiding.getNaam() === undefined) {
            leiding.setNaam(leidingDB.getNaam());
        }
        if (leiding.getEmail() === '' || leiding.getEmail() === null || leiding.getEmail() === undefined) {
            leiding.setEmail(leidingDB.getEmail());
        }
        if (leiding.getTelefoon() === '' || leiding.getTelefoon() === null || leiding.getTelefoon() === undefined) {
            leiding.setTelefoon(leidingDB.getTelefoon());
        }
        leiding.setRol(leidingDB.getRol());
        let truePass = '';
        if (leiding.getWachtwoord() === '' || leiding.getWachtwoord() === null || leiding.getWachtwoord() === undefined) {
            truePass = leidingDB.getWachtwoord();
        } else if (leiding.getWachtwoord() !== '') {
            const isSame = await bcrypt.compare(leiding.getWachtwoord(), leidingDB.getWachtwoord());
            if (!isSame) {
                truePass = await bcrypt.hash(leiding.getWachtwoord(), 12);
            }
        }
        leiding.setTotem(leidingDB.getTotem());
        const trueLeiding = new Leiding({
            id: leidingDB.getId(),
            voornaam: leiding.getVoornaam(), 
            naam: leiding.getNaam(), 
            email: leiding.getEmail(), 
            wachtwoord: truePass, 
            rol: leiding.getRol(), 
            telefoon: leiding.getTelefoon(), 
            totem: leiding.getTotem(),
            nieuwsberichten: leidingDB.getNieuwsberichten(),
            groepId: leidingDB.getGroepId()
        });
        if (trueLeiding.getWachtwoord() === '') {
            return await leidingRepo.updateLeidingNoPass(trueLeiding).then(leiding => {return PublicLeiding.from({leiding, groep: groep.getNaam()})});
        }
        const updatedLeiding = await leidingRepo.updateLeiding(trueLeiding).then(leiding => {return PublicLeiding.from({leiding, groep: groep.getNaam()})});
        return updatedLeiding;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addLeiding = async (leiding: Leiding, rol: Rol): Promise<PublicLeiding> => {
    if (rol !== 'HOOFDLEIDING' && rol !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    }
    try {
        const hashedPassword = await bcrypt.hash(leiding.getWachtwoord(), 12);
        const trueLeiding = new Leiding({
            id: 0,
            voornaam: leiding.getVoornaam(),
            naam: leiding.getNaam(),
            email: leiding.getEmail(),
            wachtwoord: hashedPassword,
            rol: leiding.getRol(),
            telefoon: leiding.getTelefoon(),
            totem: leiding.getTotem(),
            nieuwsberichten: [],
            groepId: 0
        });
        const newLeiding = await leidingRepo.createLeiding(trueLeiding);
        return PublicLeiding.from({leiding: newLeiding, groep: 'Losse leden'});
    } catch (error) {
        throw error;
    }
}

const deleteLeiding = async (id: number, rol: Rol): Promise<void> => {
    if (rol !== 'HOOFDLEIDING' && rol !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    }
    try {
        const leiding = await leidingRepo.getLeidingById({id});
        if (!leiding) {
            throw new Error('Leiding not found');
        }
        await leidingRepo.deleteLeiding({id: leiding.getId()});
    } catch (error) {
        throw error;
    }
}

const updateRol = async (id: number, rol: string, uitvoerRol: Rol): Promise<PublicLeiding> => {
    if (uitvoerRol !== 'HOOFDLEIDING' && uitvoerRol !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    } else if (rol === 'ADMIN') {
        throw new UnauthorizedError('credentials_required', new Error('max 1 admin'));
    }
    try {
        const leiding = await leidingRepo.getLeidingById({id});
        if (!leiding) {
            throw new Error('Leiding not found');
        }
        const groep = await groepService.getGroepById(leiding.getGroepId());
        if (!groep) {
            throw new Error('Groep not found');
        }
        let newRol: Rol = 'LEIDING';
        if (rol === 'HOOFDLEIDING') {
            newRol = 'HOOFDLEIDING';
        } else if (rol === 'LEIDING') {
            newRol = 'LEIDING';
        }
        leiding.setRol(newRol);
        const updatedLeiding = await leidingRepo.updateLeiding(leiding).then(leiding => {return PublicLeiding.from({leiding, groep: groep.getNaam()})});
        return updatedLeiding;
    } catch (error) {
        throw error;
    }
}

const updateGroep = async (uitvoerId: number, groepNaam: string, rol: Rol): Promise<PublicLeiding> => {
    if (rol !== 'HOOFDLEIDING' && rol !== 'ADMIN') {
        throw new UnauthorizedError('credentials_required', new Error('wrong role'));
    }
    try {
        const leiding = await leidingRepo.getLeidingById({id: uitvoerId});
         if (!leiding) {
            throw new Error('Leiding not found');
        }
        const groep = await groepService.getGroepByNaam(groepNaam);
        let id: number = leiding.getGroepId();
        if (!groep) {
            throw new Error('Groep not found');
        } else if (groep.getId()) {
            id = groep.getId();
        }
        const updatedLeiding = await leidingRepo.veranderGroep(leiding, id).then(leiding => {return PublicLeiding.from({leiding, groep: groepNaam})});
        return updatedLeiding;
    } catch (error) {
        throw error;
    }
}

export default {
    login,
    getAllLeiding,
    updateLeiding,
    addLeiding,
    deleteLeiding,
    updateRol,
    updateGroep
};