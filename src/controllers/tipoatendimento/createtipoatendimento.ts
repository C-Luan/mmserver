import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export class CreateTipoAtendimento{
    async create(req: Request, res: Response) {
        const { descricao } = req.body;
    
        try {
          const novoTipoAtendimento = await prismaClient.tipoAtendimento.create({
            data: { descricao },
          });
          return res.status(201).json(novoTipoAtendimento);
        } catch (error) {
          return res.status(500).json({ error: "Erro ao criar tipo de atendimento." });
        }
      }
    

}