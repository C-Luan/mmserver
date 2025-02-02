import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
interface sessaoEleitoral {
    numero: number;
    eleitores_secao: number;
    secao: number;
    zona: number;

}
export class CreateSessaoVotacaoController {

    async import(req: Request, res: Response) {
        try {
            const secoes: sessaoEleitoral[] = req.body;
            if (!Array.isArray(secoes)) {
                return res.status(400).json({ error: "A lista enviada não é válida" });
            }
            await Promise.all(
                secoes.map(async (local) => {
                    await prismaClient.sessoesEleitorais.create({
                        data: {
                            nVotantes: local.eleitores_secao,
                            sessao: local.secao + "",
                            zona: local.zona + "",
                            localVotacaoUuid: local.numero,
                        },
                    });
                })
            );
            res.status(200).json({ message: "Dados importados com sucesso!" });
        } catch (error) {
            console.error("Erro ao importar municípios:", error);
            res.status(500).json({ error: "Erro interno ao processar os dados" });
        }
    }
}