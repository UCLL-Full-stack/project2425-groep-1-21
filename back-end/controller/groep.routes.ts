/**
 * @swagger
 *  components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *   schemas:
 *    Groep:
 *     type: object
 *     properties:
 *      id:
 *       type: number
 *       format: int64
 *      naam:
 *       type: string
 *       description: De naam van de activiteit
 *      beschrijving:
 *       type: string
 *       description: De beschrijving van de activiteit
 *      leiding:
 *       type: array
 *       items:
 *        $ref: "#/components/schemas/Leiding"
 *      activiteiten:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Activiteit"
 *    Activiteit:
 *      type: object
 *      properties:
 *              id:
 *                  type: number
 *                  format: int64
 *              naam:
 *                  type: string
 *                  description: De naam van de activiteit
 *              beschrijving:
 *                  type: string
 *                  description: De beschrijving van de activiteit
 *              begindatum:
 *                  type: date
 *                  format: date-time
 *                  description: De begindatum van de activiteit
 *              einddatum:
 *                  type: date
 *                  format: date-time
 *                  description: De einddatum van de activiteit
 *    Leiding:
 *     type: object
 *     properties:
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
 */
import express, {NextFunction, Request, Response} from "express";
import groepService from "../service/groep.service";
import e from "express";
import { Groep } from "../model/groep";

const groepRouter = express.Router();

/**
 * @swagger
 * /groep:
 *  get:
 *    summary: Geeft alle groepen terug
 *    tags:
 *     - groep
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Groep"
 */
groepRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groepen = await groepService.getAllGroepen();
        res.status(200).json(groepen);
    } catch (e) {
        next(e);
    }
});

/**
 * @swagger
 * /groep/{naam}/activiteiten:
 *  get:
 *    summary: Geeft activiteiten van een groep terug
 *    tags:
 *     - groep
 *    parameters:
 *      - in: path
 *        name: naam
 *        required: true
 *        schema:
 *          type: string
 *        description: De naam van de groep
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Activiteit"
 */
groepRouter.get("/:naam/activiteiten", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groep = await groepService.getActiviteitenForGroep(req.params.naam);
        res.status(200).json(groep);
    } catch (e) {
        next(e);
    }
});

// /**
//  * @swagger
//  * /groep/{naam}/leiding:
//  *  get:
//  *   summary: Geeft leiding van een groep terug
//  *   tags:
//  *    - groep
//  *   parameters:
//  *    - in: path
//  *      name: naam
//  *      required: true
//  *      schema:
//  *        type: string
//  *      description: De naam van de groep
//  *   responses:
//  *    200:
//  *     description: OK
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: "#/components/schemas/Leiding"
//  */
// groepRouter.get("/:naam/leiding", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const groep = await groepService.getLeidingForGroep(req.params.naam);
//         res.status(200).json(groep);
//     } catch (e) {
//         next(e);
//     }
// });

/**
 * @swagger
 * /groep/{naam}:
 *  get:
 *   summary: Geeft een groep terug
 *   tags:
 *    - groep
 *   parameters:
 *    - in: path
 *      name: naam
 *   required: true
 *   schema:
 *    type: string
 *    description: De naam van de groep
 *   responses:
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/Groep"
 *    404:
 *     description: Niet gevonden
 */
groepRouter.get("/:naam", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groep = await groepService.getGroepByNaamForRoute(req.params.naam);
        res.status(200).json(groep);
    } catch (e) {
        next(e);
    }
});



export default groepRouter;