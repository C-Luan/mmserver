import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadSessaoEleitoralController {
    async getonlyLocalVotacao(req: Request, res: Response) {
        try {
            const { sessao, zona } = req.query;

            // Converte os valores para número, se necessário
            const sessaoNumber = sessao ? String(sessao) : undefined;
            const zonaNumber = zona ? String(zona) : undefined;

            // Monta o filtro de busca apenas se os valores forem válidos
            const whereClause: any = {};
            if (sessaoNumber) whereClause.sessao = sessaoNumber;
            if (zonaNumber) whereClause.zona = zonaNumber;

            const locaisVotacao = await prismaClient.sessoesEleitorais.findFirst({
                where: whereClause, include: {
                    LocalVotacao: true
                }
            });
            return res.json(locaisVotacao?.LocalVotacao);
        } catch (error) {
            console.error("Erro ao buscar sessões eleitorais:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
