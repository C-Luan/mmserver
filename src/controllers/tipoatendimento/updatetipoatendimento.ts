import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class UpdateTipoAtendimentoController {
    // Atualizar um tipo de atendimento
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { descricao } = req.body;

        try {
            const tipoAtendimentoAtualizado = await prismaClient.tipoAtendimento.update({
                where: { id: Number(id) },
                data: { descricao },
            });

            return res.status(200).json(tipoAtendimentoAtualizado);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar tipo de atendimento." });
        }
    }

}