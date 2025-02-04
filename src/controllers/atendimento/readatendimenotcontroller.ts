import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadAtendimentoController {
    async readAtendimentosEleitor(req: Request, res: Response) {
        try {
            const { eleitorUuid } = req.params;
            console.log(eleitorUuid)
            // Validação para evitar requisições sem o UUID
            if (!eleitorUuid) {
                return res.status(400).json({ error: "Eleitor UUID é obrigatório." });
            }

            // Buscando os atendimentos no banco de dados
            const atendimentos = await prismaClient.atendimento.findMany({
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
                    dataatendimento:true,
                    eleitor: {
                        include: {
                            EnderecoEleitor: true,
                            DadosPessoaisEleitor: true,
                            contatoEleitor: true,
                            MidiasSociaisEleitor: true,
                            classificacao: true,
                            // candidato:true,
                            // criado_por:true,
                        }
                    },
                    responsavelUuid: true,
                    responsavel: true,
                    tipoAtendimento: true,
                    custo: true,
                },

            });

            // Retornando os atendimentos encontrados
            return res.json(atendimentos);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    }
    async readAtendimentosAll(req: Request, res: Response) {
        try {




            // Buscando os atendimentos no banco de dados
            const atendimentos = await prismaClient.atendimento.findMany({
                orderBy: {
                    created_at: "desc"
                },

                select: {
                    created_at: true,
                    atendimento: true,
                    updated_at: true,
                    descricao: true,
                    criado_por: true,
                    dataatendimento:true,
                    eleitor: {
                        include: {
                            EnderecoEleitor: true,
                            DadosPessoaisEleitor: true,
                            contatoEleitor: true,
                            MidiasSociaisEleitor: true,
                            classificacao: true,
                            // candidato:true,
                            // criado_por:true,
                        }
                    },
                    responsavelUuid: true,
                    responsavel: true,
                    tipoAtendimento: true,
                    custo: true,
                },

            });

            // Retornando os atendimentos encontrados
        
            return res.json(atendimentos);

        } catch (error) {
            console.error("Erro ao buscar atendimentos:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    }
}
