import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class ReadTipoAtendimento {

    // Obter todos os tipos de atendimento
    async findAll(req: Request, res: Response) {
        try {
            const tiposAtendimento = await prismaClient.tipoAtendimento.findMany();
            return res.status(200).json(tiposAtendimento);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar tipos de atendimento." });
        }
    }

    // Obter um tipo de atendimento por ID
    async findOne(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const tipoAtendimento = await prismaClient.tipoAtendimento.findUnique({
                where: { id: Number(id) },
            });

            if (!tipoAtendimento) {
                return res.status(404).json({ error: "Tipo de atendimento não encontrado." });
            }

            return res.status(200).json(tipoAtendimento);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar tipo de atendimento." });
        }
    }


}