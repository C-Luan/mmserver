import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class Readufcontroller {
    readmany(req: Request, res: Response) {
        try {
            const unidades = prismaClient.uF.findMany({
                include: {
                    municipio: true,
                }
            })
            res.status(200).json(unidades)
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }
    }
}