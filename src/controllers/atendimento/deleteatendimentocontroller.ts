import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class DeleteTarefasController {
    async deleteTarefa(req: Request, res: Response) {
        const { tarefaUuid } = req.params; // UUID da tarefa a ser deletada

        try {
            // Verifica se a tarefa existe
            const tarefaExistente = await prismaClient.atendimento.findUnique({
                where: { uuid: tarefaUuid },
            });

            if (!tarefaExistente) {
                return res.status(404).json({ message: "Tarefa não encontrada." });
            }

            // Exclui a tarefa
            await prismaClient.atendimento.delete({
                where: { uuid: tarefaUuid },
            });

            return res.status(200).json({ message: "Tarefa excluída com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
            return res.status(500).json({
                message: "Erro interno ao excluir a tarefa.",
                error: error,
            });
        }
    }
}
