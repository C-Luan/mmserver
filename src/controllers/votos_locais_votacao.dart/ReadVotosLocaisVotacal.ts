import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
interface sequencial {
    sequencial: number
}
export class ReadVotosLocaisVotacao {
    async readvotos(req: Request, res: Response) {
        const { sequencial } = req.body

        try {
            const sequencialBigInt = typeof sequencial === 'number' ? BigInt(sequencial) : sequencial;
            const votos = await prismaClient.localVotacao_has_candidatoEleicao.findMany({
                where: {
                    candidatosEleicaoSequencial: sequencialBigInt
                }, include: {
                    localvontacao: {
                        include: {
                            endereco: true,
                        }
                    },
                    quantidade_votos_eleicao: true
                }
            })
            // Função para converter BigInt para string antes de retornar no JSON
            const convertBigIntToString = (obj: any) => {
                for (const key in obj) {
                    if (typeof obj[key] === 'bigint') {
                        obj[key] = obj[key].toString();  // Converte BigInt para string
                    }
                }
                return obj;
            };

            // Se o resultado for um array, converte BigInt em cada objeto
            const sanitizedVotos = votos.map(voto => convertBigIntToString(voto));
            res.status(200).json(sanitizedVotos);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "internal server error" })
        }

    }
}