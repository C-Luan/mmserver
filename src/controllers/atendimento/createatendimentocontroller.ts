import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
import logger from "../../winston";


export class CreateAtendimentoController {
    async handle(req: Request, res: Response) {
        const { descricao, responsavelUuid, tipoAtendimento, dataatendimento, eleitorUuid, custo, } = req.body;

        if (!descricao || !responsavelUuid || !tipoAtendimento || !eleitorUuid) {
            logger.warn("Tentativa de criação com campos ausentes: %o", req.body);
            return res.status(400).json({
                message: "Campos obrigatórios ausentes: descrição, responsavelUuid, tipoAtendimento, eleitorUuid."
            });
        }

        try {
            const atendimento = await prismaClient.atendimento.create({
                data: {
                    usuarioUuid: req.uuid,
                    responsavelUuid,
                    dataatendimento,
                    tipoAtendimento,
                    eleitorUuid,
                    descricao,
                    custo,
                },
            });

            logger.info("Atendimento criado com sucesso: %o", atendimento);
            return res.status(200).json(atendimento);
        } catch (error) {
            logger.error("Erro ao criar atendimento: %o", error);

            return res.status(500).json({
                message: "Erro interno do servidor ao criar atendimento. Por favor, tente novamente mais tarde.",
            });
        }
    }
}
