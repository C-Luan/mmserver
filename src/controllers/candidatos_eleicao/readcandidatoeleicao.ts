import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadCandidatoEleicao {
    async readmunicio(req: Request, res: Response) {
        const { municipioId, eleicoesUuid } = req.params;

        try {
            const candidatos = await prismaClient.candidatosEleicao.findMany({
                where: {
                    municipioId: Number(municipioId),
                    eleicoesUuid: eleicoesUuid
                }
            });
            res.status(200).json(candidatos);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "internal server error"
            });
        }
    }
}
