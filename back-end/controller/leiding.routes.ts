/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Activiteit:
 *          type: object
 *          properties:
 *             id:
 *              type: number
 *              format: int64
 *             naam:
 *              type: string
 *              description: De naam van de leiding
 *             beschrijving:
 *              type: string
 *              description: De beschrijving van de leiding
 *             begindatum:
 *              type: date
 *              format: date-time
 *              description: De begindatum van de leiding
 *             einddatum:
 *              type: date
 *              format: date-time
 *              description: De einddatum van de leiding
 *      Groep:
 *        type: object
 *        properties:
 *         id:
 *          type: number
 *          format: int64
 *         naam:
 *          type: string
 *          description: De naam van de groep
 *         beschrijving:
 *          type: string
 *          description: De beschrijving van de groep
 *         leiding:
 *          type: array
 *          items:
 *           $ref: "#/components/schemas/Leiding"
 *      Leiding:
 *       type: object
 *       properties:
 *        id:
 *         type: number
 *         format: int64
 *        naam:
 *         type: string
 *         description: De naam van de leiding
 *        voornaam:
 *         type: string
 *         description: De voornaam van de leiding
 *        email:
 *         type: string
 *         description: Het emailadres van de leiding
 *        telefoon:
 *         type: string
 *         description: Het telefoonnummer van de leiding
 *        hoodleiding:
 *         type: boolean
 *         description: Of de leiding hoofdleiding is
 *        totem:
 *         type: string
 *         description: De totem van de leiding
 *        groep:
 *         $ref: "#/components/schemas/Groep"
 *        nieuwsberichten:
 *         type: array
 *         items:
 *          $ref: "#/components/schemas/Nieuwsbericht"
 *        wachtwoord:
 *          type: string
 *          description: Het wachtwoord van de leiding
 *        rol:
 *          type: string
 *          description: De rol van de leiding
 *      Nieuwsbericht:
 *        type: object
 *        properties:
 *         id:
 *          type: number
 *          format: int64
 *         titel:
 *           type: string
 *           description: De titel van het nieuwsbericht
 *         inhoud:
 *           type: string
 *           description: De inhoud van het nieuwsbericht
 *         datum:
 *           type: date
 *           format: date-time
 *           description: De datum van het nieuwsbericht
 *         leiding:
 *          $ref: "#/components/schemas/PublicLeiding"
 *      PublicLeiding:
 *       type: object
 *       properties:
 *        id:
 *         type: number
 *         format: int64
 *        naam:
 *         type: string
 *         description: De naam van de leiding
 *        voornaam:
 *         type: string
 *         description: De voornaam van de leiding
 *        email:
 *          type: string
 *          description: Het emailadres van de leiding
 *        telefoon:
 *          type: string
 *          description: Het telefoonnummer van de leiding
 *        totem:
 *          type: string
 *          description: De totem van de leiding
 *        rol:
 *          type: string
 *          description: De rol van de leiding
 *        groepId:
 *          type: number
 *          format: int64
 *          description: Het id van de groep van de leiding
 */
import express, {NextFunction, Request, Response} from "express";
import leidingService from "../service/leiding.service";
import { Leiding } from "../model/leiding";
import { Rol } from "../types";
import jwt from "jsonwebtoken";

const leidingRouter = express.Router();

/**
 * @swagger
 * /leiding/login:
 *  post:
 *   summary: Geeft een token terug als de leider correct is ingelogd
 *   tags:
 *     - Leiding
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                 type: object
 *                 properties: 
 *                    totem:
 *                     type: string 
 *                    wachtwoord:
 *                     type: string                  
 *   responses:
 *      200:
 *          description: Een token
 *          content:
 *            application/json:
 *              schema:
 *                  type: string
 */
leidingRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { totem, wachtwoord } = req.body;
        const token = await leidingService.login(totem, wachtwoord);
        res.json(token);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /leiding:
 *  get:
 *   security:
 *    - bearerAuth: []
 *   summary: Geeft alle leiders terug
 *   tags:
 *     - Leiding
 *   responses:
 *      200:
 *          description: Een array van leiding elementen
 *          content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *                 $ref: "#/components/schemas/PublicLeiding"
 */
leidingRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const leiding = await leidingService.getAllLeiding(decoded.rol);
        res.json(leiding);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /leiding:
 *  put:
 *   security:
 *    - bearerAuth: []
 *   summary: Verander een leider, totem en groep niet aanpasbaar
 *   tags:
 *    - Leiding
 *   requestBody:
 *     required: true
 *     content:
 *        application/json:
 *           schema:
 *             $ref: "#/components/schemas/Leiding"
 *   responses:
 *     200:
 *       description: De veranderde leiding
 *       content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/PublicLeiding"
 *     400:
 *       description: Fout in de request
 *     404:
 *      description: Leiding niet gevonden
 *     401:
 *      description: Niet geautoriseerd
 */
leidingRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
 
        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const leiding = new Leiding({
            id: req.body.id,
            naam: req.body.naam,
            voornaam: req.body.voornaam,
            email: req.body.email,
            wachtwoord: req.body.wachtwoord,
            telefoon: req.body.telefoon,
            rol: req.body.rol,
            totem: req.body.totem,
            nieuwsberichten: req.body.nieuwsberichten,
            groepId: req.body.groepId
        });
        const result = await leidingService.updateLeiding(leiding, decoded.rol, decoded.totem);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /leiding:
 *  post:
 *   security:
 *    - bearerAuth: []
 *   summary: Voeg een leider toe
 *   tags:
 *    - Leiding
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/Leiding"
 *   responses:
 *    200:
 *     description: De toegevoegde leiding
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/PublicLeiding"
 *    400:
 *     description: Fout in de request
 *    401:
 *     description: Niet geautoriseerd
 */ 
leidingRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const leiding = new Leiding({
            id: req.body.id,
            naam: req.body.naam,
            voornaam: req.body.voornaam,
            email: req.body.email,
            wachtwoord: req.body.wachtwoord,
            telefoon: req.body.telefoon,
            rol: req.body.rol,
            totem: req.body.totem,
            nieuwsberichten: req.body.nieuwsberichten,
            groepId: req.body.groepId
        });
        const result = await leidingService.addLeiding(leiding, decoded.rol);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /leiding:
 *  delete:
 *   security:
 *    - bearerAuth: []
 *   summary: Verwijder een leider
 *   tags:
 *    - Leiding
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: number
 *          format: int64
 *   responses:
 *    200:
 *     description: De verwijderde leiding
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/PublicLeiding"
 *    400:
 *     description: Fout in de request
 *    401:
 *     description: Niet geautoriseerd
 */
leidingRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const result = await leidingService.deleteLeiding(Number(req.body.id), decoded.rol);
        res.json(result);
    } catch (e) {
        next(e);
    }
}); 

/**
 * @swagger
 * /leiding/{id}/{rol}:
 *  put:
 *   security:
 *    - bearerAuth: []
 *   summary: Verander de rol van een leider, enkel LEIDING of HOOFDLEIDING
 *   tags:
 *    - Leiding
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Het id van de leiding
 *       schema:
 *           type: number
 *           format: int64
 *           example: 1
 *     - in: path
 *       name: rol 
 *       required: true
 *       description: De nieuwe rol van de leiding
 *       schema:
 *           type: string
 *           example: "LEIDING"
 *   responses:
 *     200:
 *      description: De veranderde leiding
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/PublicLeiding"
 *     400:
 *        description: Fout in de request
 *     404:
 *        description: Leiding niet gevonden
 *     401:
 *        description: Niet geautoriseerd
 */
leidingRouter.put('/:id/:rol', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const result = await leidingService.updateRol(Number(req.params.id), req.params.rol, decoded.rol);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 *  /leiding/groep/{id}/{groepNaam}:
 *   put:
 *    security:
 *     - bearerAuth: []
 *    summary: Verander de groep van een leider
 *    tags:
 *      - Leiding
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Het id van de leiding
 *        schema:
 *           type: number
 *           format: int64
 *           example: 1
 *      - in: path
 *        name: groepNaam
 *        required: true
 *        description: De nieuwe groep van de leiding
 *        schema:
 *            type: string
 *            example: "Kapoenen"
 *    responses:
 *     200:
 *      description: De veranderde leiding
 *      content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PublicLeiding"
 *     400:
 *       description: Fout in de request
 *     404:
 *       description: Leiding niet gevonden
 *     401:
 *       description: Niet geautoriseerd  
 */
leidingRouter.put('/groep/:id/:groepNaam', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 

        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token? token: "", secret) as { totem: string, rol: Rol};
        const result = await leidingService.updateGroep(Number(req.params.id), req.params.groepNaam, decoded.rol);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

export default leidingRouter;