import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class UpdateTarefasController {
    async updateTarefa(req: Request, res: Response) {
        const { tarefaUuid } = req.params; // UUID da tarefa a ser atualizada
        const { descricao, tipoAtendimento, responsavelUuid } = req.body; // Campos a serem atualizados

        try {
            // Verifica se a tarefa existe
            const tarefaExistente = await prismaClient.atendimento.findUnique({
                where: { uuid: tarefaUuid },
            });

            if (!tarefaExistente) {
                return res.status(404).json({ message: "Tarefa não encontrada." });
            }

            // Atualiza a tarefa
            const tarefaAtualizada = await prismaClient.atendimento.update({
                where: { uuid: tarefaUuid },
                data: {
                    descricao: descricao || tarefaExistente.descricao,
                    responsavelUuid: responsavelUuid || tarefaExistente.responsavelUuid,
                    tipoAtendimento:tipoAtendimento
                },
            });

            return res.status(200).json({
                message: "Tarefa atualizada com sucesso.",
                tarefa: tarefaAtualizada,
            });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            return res.status(500).json({
                message: "Erro interno ao atualizar a tarefa.",
                error: error,
            });
        }
    }
}
