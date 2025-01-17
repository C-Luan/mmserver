import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class CreateEnderecoLocalVotacaoController {

    async createmany(req: Request, res: Response) {
        const { data } = req.body
        try {
            const result = await prismaClient.enderecoLocalVotacao.createMany({
                data: data,

            })

            res.status(200).json({ message: "Registros criados" + result.count, result })
        } catch (error) {
            console.log(error)
          
            res.status(500).json({ message: "Falha Interna do servidor", error: error })
        }
    }
}