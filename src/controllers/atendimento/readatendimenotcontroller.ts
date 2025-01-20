import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadAtendimentoController {
    async readAtendimentosEleitor(req: Request, res: Response) {
        const { eleitorUuid } = req.params
        const atendimentos = prismaClient.atendimento.findMany({
            orderBy: {
                created_at: "desc"
            },
            where: {
                eleitorUuid: eleitorUuid
            },
            select: {
                created_at: true,
                atendimento: true,
                updated_at: true,
                descricao: true,
                criado_por: true,
                responsavel: true,
                tipoAtendimento: true
            }
        })
    }
}