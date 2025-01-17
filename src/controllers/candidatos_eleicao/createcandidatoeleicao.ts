import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

interface CandidatoEleicao {
    eleicoesUuid: string,
    municipioId: number,
    cargoCandidato: string,
    numero_urna: number,
    nomecandidato: string,
    sequencial: number,
}
export class CreateCandidatoEleicao {


    async createEleitorImportado(req: Request, res: Response) {
        try {
            const { data } = req.body
            data.forEach(async (element: CandidatoEleicao) => {
           try {
            await prismaClient.candidatosEleicao.create({
                data: {
                    eleicoesUuid: element.eleicoesUuid,
                    municipioId: element.municipioId,
                    cargoCandidato: element.cargoCandidato,
                    numero_urna: element.numero_urna,
                    sequencial: element.sequencial,
                    nomecandidato: element.nomecandidato,
                }
            })
           } catch (error) {
            
           }
            })
            res.status(200).json({ message: "Candidatos cadastrados" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }
    }


}