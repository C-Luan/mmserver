import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

interface VotoLocalVotacao {
    sequencial: number;
    localvotacao: string;
    qtvotos: number;
}

export class CreateVotosLocaisVotacao {
    async createimportvotoslocalvotacao(req: Request, res: Response) {
        try {
            const data = req.body;

            for (const e of data) {
                try {
                    const localdevotacao = await prismaClient.localVotacao.findFirst({
                        where: {
                            localdevotacao: {
                                contains: e.localvotacao
                            }
                        }
                    });

                    if (localdevotacao != null) {
                        await prismaClient.localVotacao_has_candidatoEleicao.create({
                            data: {
                                candidatosEleicaoSequencial: e.sequencial,
                                localVotacaoUuid: localdevotacao.uuid,
                                quantidade_votos_eleicao: {
                                    create: {
                                        votos: e.qtvotos,
                                    }
                                }
                            }
                        });
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        console.error(`Erro ao processar o item ${JSON.stringify(e)}:`, error.message);
                    } else {
                        console.error("Erro desconhecido:", error);
                    }
                }
            }

            return res.status(200).json({ message: "Dados processados com sucesso" });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erro ao processar a requisição:", error.message);
                return res.status(500).json({ message: "Erro interno do servidor", error: error.message });
            } else {
                console.error("Erro desconhecido:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    }
}
