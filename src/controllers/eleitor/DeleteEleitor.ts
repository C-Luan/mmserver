import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

interface key {
    key: string
}

export class DeleteEleitorController {
    async deleteVarios(req: Request, res: Response) {
        try {
            const uuid = req.uuid
            const { data } = req.body

            // Busca o usuário no banco de dados
            const usuario = await prismaClient.usuario.findUnique({
                where: { uuid },
                include: { coligacao: true, candidato: true },
            })

            // Verifica se o usuário tem permissão para deletar
            if (usuario?.perfil == 1 || usuario?.perfil == 4 ||usuario?.perfil == 2 || usuario?.perfil ==3) {
                // Deletar eleitores em paralelo utilizando Promise.all
                await Promise.all(data.map(async (element: { key: string }) => {
                    try {
                        await prismaClient.eleitor.delete({
                            where: { uuid: element.key }
                        })
                    } catch (error) {
                        console.log(`Erro ao deletar eleitor com UUID ${element.key}:`, error)
                    }
                }))
                return res.status(200).json({ message: "Sucesso" })
            } else {
                return res.status(401).json({ message: "Usuário Não Autorizado" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Erro Interno do Servidor" })
        }
    }
}
