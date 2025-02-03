import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";
import { ReadEleitorController } from "../eleitor/ReadEleitorController";
export class DashboardScreenController {

    async read(req: Request, res: Response) {
        try {
            const uuidusuario = req.uuid
            const eleitores = await prismaClient.eleitor.findMany({
                include: {
                    EnderecoEleitor: true,
                    sessaoeleitoral: {
                        include:{
                            endereco:true,
                        }
                    },
                    atendimento: {
                        include:{
                            atendimento:true
                        }
                    },
                    
                }
            });
            const localdevotacao = await prismaClient.localVotacao.findMany({
                include: {
                    
                    endereco:true,
                    sessoesEleitorais: true,
                }
            })
            const atendimentos = await prismaClient.atendimento.findMany({
                include:{
                    atendimento:true,
                }
            })
            return res.status(200).json({
                eleitores: eleitores,
                localdevotacao: localdevotacao,
                atendimentos: atendimentos,
            })
         
        }
        catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Erro interno do servidor"
            })
        }
    }
}
