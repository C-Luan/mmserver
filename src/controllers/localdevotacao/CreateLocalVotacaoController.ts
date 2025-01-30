import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
interface localdevotacao {
    id_municipio: number;
    id_municipio_nome: string;
    id_municipio_tse: number;
    id_municipio_tse_nome: string;
    tipo_secao_agregada: number;
    numero: number;
    nome: string;
    endereco: string;
    bairro: string;
    cep: number;
    latitude: string;
    longitude: string;
    eleitores: number;
}
export class CreateLocalVotacaoController {

    async createmany(req: Request, res: Response) {
        const { data } = req.body
        try {
            const result = await prismaClient.localVotacao.createMany({
                data: data,
                skipDuplicates: true
            })

            res.status(200).json({ message: "Registros criados" + result.count, result })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Falha Interna do servidor", error: error })
        }
    }
    static async import(req: Request, res: Response) {
        try {
            const municipios: localdevotacao[] = req.body;

            if (!Array.isArray(municipios)) {
                return res.status(400).json({ error: "A lista enviada não é válida" });
            }

            // Inserindo os dados corretamente usando `Promise.all`
            await Promise.all(
                municipios.map(async (local) => {
                    await prismaClient.localVotacao.create({
                        data: {
                            uuid: local.numero,
                            localdevotacao: local.nome,
                            numerotse: local.id_municipio_tse,
                            totalEleitores: local.eleitores,
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