import { Request, Response } from "express";
import diacritic from "diacritic";
import { prismaClient } from "../../database/prismaClient";

export class CreateTipoAtendimento {
  async create(req: Request, res: Response) {
    const { descricao } = req.body;

    if (!descricao) {
      return res.status(400).json({ error: "A descrição é obrigatória." });
    }

    try {
      // Remove acentos e transforma em maiúsculas
      const descricaoFormatada = diacritic.clean(descricao).toUpperCase();

      const novoTipoAtendimento = await prismaClient.tipoAtendimento.create({
        data: { descricao: descricaoFormatada },
      });

      return res.status(200).json(novoTipoAtendimento);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar tipo de atendimento.", falha: error });
    }
  }
}
